#!/usr/bin/env python3

import json
import multiprocessing
import os
import requests
import sys
import time

from collections import OrderedDict

from elasticsearch1 import Elasticsearch
from elasticsearch1.helpers import scan


def _month_gen(start=None, end=None):
    """Generate YYYY-MM stings from all the months, inclusively, between the
    given start and end dates.

    FIXME - We have this hard-coded for now.
    """
    for (
        month
    ) in "2020-09 2020-10 2020-11 2020-12 2021-01 2021-02 2021-03 2021-04 2021-05 2021-06 2021-07 2021-08 2021-09 2021-10".split(
        " "
    ):
        yield month


def result_index_gen(month_gen):
    """Yield all the result index patterns for each month yielded from the given
    generator.
    """
    for month in month_gen:
        yield f"dsa-pbench.v4.result-data.{month}-*"


def run_index_gen(month_gen):
    """Yield all the run data index patterns for each month yielded from the given
    generator.
    """
    for month in month_gen:
        yield f"dsa-pbench.v4.run.{month}"


def es_data_gen(es, index, doc_type):
    """Yield documents where the `run.script` field is "fio" for the given index
    and document type.
    """
    query = {"query": {"query_string": {"query": "run.script:fio"}}}

    for doc in scan(es, query=query, index=index, doc_type=doc_type, scroll="1m",):
        yield doc


def pbench_runs_gen(es, month_gen):
    """Yield all the pbench run documents using the given month generator.
    """
    for run_index in run_index_gen(month_gen):
        for doc in es_data_gen(es, run_index, "pbench-run"):
            yield doc


def pbench_result_data_samples_gen(es, month_gen):
    """Yield all the pbench result data sample documents using the given month
    generator.
    """
    for result_index in result_index_gen(month_gen):
        for doc in es_data_gen(es, result_index, "pbench-result-data-sample"):
            yield doc


def load_pbench_runs(es):
    """Load all the pbench run data, sub-setting to contain only the fields we
    require.

    We also ignore any pbench run without a `controller_dir` field or without
    a `sosreports` field.

    A few statistics about the processing is printed to stdout.

    Returns a dictionary containing the processed pbench run documents
    """
    pbench_runs = dict()

    recs = 0
    missing_ctrl_dir = 0
    missing_sos = 0
    accepted = 0

    for _source in pbench_runs_gen(es, _month_gen()):
        recs += 1

        run = _source["_source"]
        run_id = run["@metadata"]["md5"]
        if "controller_dir" not in run["@metadata"]:
            missing_ctrl_dir += 1
            print(f"pbench run with no controller_dir: {run_id}")
            continue

        if "sosreports" not in run:
            missing_sos += 1
            continue

        accepted += 1

        run_index = _source["_index"]

        sosreports = dict()
        for sosreport in run["sosreports"]:
            sosreports[os.path.split(sosreport["name"])[1]] = {
                "hostname-s": sosreport["hostname-s"],
                "hostname-f": sosreport["hostname-f"],
                "time": sosreport["name"].split("/")[2],
            }

        pbench_runs[run_id] = dict(
            run_id=run_id,
            run_index=run_index,
            controller_dir=run["@metadata"]["controller_dir"],
            sosreports=sosreports,
        )

    print(
        f"Stats for pbench runs: accepted {accepted:n} records of"
        f" {recs:n}, missing 'controller_dir' field {missing_ctrl_dir:n},"
        f" missing 'sosreports' field {missing_sos:n}",
        flush=True,
    )

    return pbench_runs


# extract controller directory and sosreports'
# names associated with each pbench run
def extract_run_metadata(
    results,
    result_to_run,
    run_to_results,
    run_record,
    run_index,
    incoming_url,
    session,
    es,
):
    # print (f"Entered run metadata: {run_record['run']['name']}")

    temp = dict()

    # since clientnames are common to all iterations
    clientnames = None

    # since disknames and hostnames are common to all samples
    current_iter_name = None

    # since sosreports are common to all results per run
    sosreports = None

    for result_id in run_to_results[run_record["@metadata"]["md5"]]:
        result = results[result_id]
        result["run_index"] = run_index
        result["controller_dir"] = run_record["@metadata"]["controller_dir"]

        if sosreports is None:
            sosreports = dict()
            for sosreport in run_record["sosreports"]:
                sosreports[os.path.split(sosreport["name"])[1]] = {
                    "hostname-s": sosreport["hostname-s"],
                    "hostname-f": sosreport["hostname-f"],
                    "time": sosreport["name"].split("/")[2],
                }
        result["sosreports"] = sosreports

        # add host and disk names in the data here
        iter_name = result["iteration.name"]
        if current_iter_name != iter_name:
            # print ("Before fio")
            disknames, hostnames = extract_fio_result(result, incoming_url, session)
            current_iter_name = iter_name
        result["disknames"] = disknames
        result["hostnames"] = hostnames

        # add client names here
        if clientnames is None:
            # print ("Before clients")
            clientnames = extract_clients(result, es)
        result["clientnames"] = clientnames

        temp[result_id] = result

    return temp


# extract list of clients from the URL
def extract_clients(results_meta, es):
    run_index = results_meta["run_index"]
    parent_id = results_meta["run.id"]
    iter_name = results_meta["iteration.name"]
    sample_name = results_meta["sample.name"]
    parent_dir_name = f"/{iter_name}/{sample_name}/clients"
    query = {
        "query": {
            "query_string": {
                "query": f'_parent:"{parent_id}"'
                f' AND ancestor_path_elements:"{iter_name}"'
                f' AND ancestor_path_elements:"{sample_name}"'
                f" AND ancestor_path_elements:clients"
            }
        }
    }

    client_names_raw = []
    for doc in scan(
        es, query=query, index=run_index, doc_type="pbench-run-toc-entry", scroll="1m",
    ):
        src = doc["_source"]
        assert (
            src["parent"] == parent_dir_name
        ), f"unexpected parent directory: {src['parent']} != {parent_dir_name} -- {doc!r}"
        client_names_raw.append(src["name"])
    return list(set(client_names_raw))


# extract host and disk names from fio-result.txt
def extract_fio_result(results_meta, incoming_url, session):
    url = (
        incoming_url
        + results_meta["controller_dir"]
        + "/"
        + results_meta["run.name"]
        + "/"
        + results_meta["iteration.name"]
        + "/"
        + results_meta["sample.name"]
        + "/"
        + "fio-result.txt"
    )

    # check if the page is accessible
    response = session.get(url, allow_redirects=True)
    if response.status_code != 200:  # successful
        return [[], []]

    try:
        document = response.json()
    except ValueError:
        print("Response content is not valid JSON")
        print(url)
        print(response.content)
        return [[], []]

    if "disk_util" in document.keys():
        disknames = [
            disk["name"] for disk in document["disk_util"] if "name" in disk.keys()
        ]
    else:
        disknames = []

    if "client_stats" in document.keys():
        hostnames = list(
            set(
                [
                    host["hostname"]
                    for host in document["client_stats"]
                    if "hostname" in host.keys()
                ]
            )
        )
    else:
        hostnames = []

    return [disknames, hostnames]


def transform_result(source, pbench_runs, results_seen, stats):
    """Transform the raw result data sample document to a stripped down version,
    augmented with pbench run data.
    """
    result_id = source["_id"]
    assert result_id not in results_seen, f"Result ID {result_id} repeated"
    results_seen[result_id] = True

    try:
        index = source["_source"]
        run = index["run"]
        run_id = run["id"]
        run_name = run["name"]
        iter_name = index["iteration"]["name"]
        sample = index["sample"]
        sample_name = sample["name"]
        sample_m_type = sample["measurement_type"]
        sample_m_title = sample["measurement_title"]
        sample_m_idx = sample["measurement_idx"]
    except KeyError as exc:
        print(
            # f"ERROR - {filename}, {exc}, {json.dumps(index)}", file=sys.stderr,
            f"ERROR - {exc}, {json.dumps(index)}",
            file=sys.stderr,
        )
        stats["errors"] += 1
        return None

    try:
        pbench_run = pbench_runs[run_id]
    except KeyError:
        # print(
        #    f"*** Result without a run: {run_ctrl}/{run_name}/{iter_name}"
        #    f"/{sample_name}/{sample_m_type}/{sample_m_title}"
        #    f"/{sample_m_idx}",
        #    flush=True,
        # )
        stats["missing_runs"] += 1
        return None

    if "mean" not in sample:
        # print(
        #    f"No 'mean' in {run_ctrl}/{run_name}/{iter_name}"
        #    f"/{sample_name}/{sample_m_type}/{sample_m_title}"
        #    f"/{sample_m_idx}",
        #    flush=True,
        # )
        stats["missing_mean"] += 1
        return None

    # The following field names are required
    try:
        benchmark = index["benchmark"]
        result = OrderedDict()
        result.update(
            [
                ("run.id", run_id),
                ("iteration.name", iter_name),
                ("sample.name", sample_name),
                ("run.name", run_name),
                ("benchmark.bs", benchmark["bs"]),
                ("benchmark.direct", benchmark["direct"]),
                ("benchmark.ioengine", benchmark["ioengine"]),
                ("benchmark.max_stddevpct", benchmark["max_stddevpct"]),
                ("benchmark.primary_metric", benchmark["primary_metric"]),
                ("benchmark.rw", ", ".join(set((benchmark["rw"].split(","))))),
                ("sample.client_hostname", sample["client_hostname"]),
                ("sample.measurement_type", sample_m_type),
                ("sample.measurement_title", sample_m_title),
                ("sample.measurement_idx", sample_m_idx),
                ("sample.mean", sample["mean"]),
                ("sample.stddev", sample["stddev"]),
                ("sample.stddevpct", sample["stddevpct"]),
            ]
        )
    except KeyError as exc:
        print(
            # f"ERROR - {filename}, {exc}, {json.dumps(index)}", file=sys.stderr,
            f"ERROR - {exc}, {json.dumps(index)}",
            file=sys.stderr,
        )
        stats["errors"] += 1
        return None

    stats["mean"] += 1

    result["run_index"] = pbench_run["run_index"]
    result["controller_dir"] = pbench_run["controller_dir"]
    result["sosreports"] = pbench_run["sosreports"]

    # optional workload parameters
    try:
        result["benchmark.filename"] = ", ".join(
            set((benchmark["filename"].split(",")))
        )
    except KeyError:
        result["benchmark.filename"] = "/tmp/fio"
    try:
        result["benchmark.iodepth"] = benchmark["iodepth"]
    except KeyError:
        result["benchmark.iodepth"] = "32"
    try:
        result["benchmark.size"] = ", ".join(set((benchmark["size"].split(","))))
    except KeyError:
        result["benchmark.size"] = "4096M"
    try:
        result["benchmark.numjobs"] = ", ".join(set((benchmark["numjobs"].split(","))))
    except KeyError:
        result["benchmark.numjobs"] = "1"
    try:
        result["benchmark.ramp_time"] = benchmark["ramp_time"]
    except KeyError:
        result["benchmark.ramp_time"] = "none"
    try:
        result["benchmark.runtime"] = benchmark["runtime"]
    except KeyError:
        result["benchmark.runtime"] = "none"
    try:
        result["benchmark.sync"] = benchmark["sync"]
    except KeyError:
        result["benchmark.sync"] = "none"
    try:
        result["benchmark.time_based"] = benchmark["time_based"]
    except KeyError:
        result["benchmark.time_based"] = "none"

    return result


def process_results(es, incoming_url, pool, pbench_runs, stats):
    """Intermediate generator for handling the fetching of the client names, disk
    names, and host names.

    """
    stats["total_recs"] = 0
    stats["missing_mean"] = 0
    stats["missing_runs"] = 0
    stats["errors"] = 0
    stats["mean"] = 0

    results_seen = dict()

    for _source in pbench_result_data_samples_gen(es, _month_gen()):
        stats["total_recs"] += 1
        result = transform_result(_source, pbench_runs, results_seen, stats)
        if result is None:
            continue
        yield result


def main(args):
    # Number of CPUs to use (where 0 = n CPUs)
    concurrency = int(args[1])

    es_host = args[2]
    es_port = args[3]

    # URL prefix to fetch unpacked data
    url_prefix = args[4]
    incoming_url = f"{url_prefix}/incoming/"

    # If requested, profile memory usage
    try:
        profile_arg = int(args[5])
    except (IndexError, ValueError):
        profile = False
    else:
        profile = profile_arg != 0

    if profile:
        from guppy import hpy

        memprof = hpy()
    else:
        memprof = None

    # We create the multiprocessing pool first to avoid forking a sub-process
    # with lots of memory allocated.
    ncpus = multiprocessing.cpu_count() - 1 if concurrency == 0 else concurrency
    pool = multiprocessing.Pool(ncpus) if ncpus != 1 else None

    if memprof:
        print(f"Initial memory profile ... {memprof.heap()}", flush=True)

    scan_start = time.time()

    es = Elasticsearch([f"{es_host}:{es_port}"])
    pbench_runs = load_pbench_runs(es)

    result_cnt = 0
    stats = dict()

    session = requests.Session()
    ua = session.headers["User-Agent"]
    session.headers.update({"User-Agent": f"{ua} -- merge_sos_and_perf_parallel"})

    with open("sosreport_fio.txt", "w") as log, open(
        "output_latest_fio.json", "w"
    ) as outfile:
        generator = process_results(es, incoming_url, pool, pbench_runs, stats)
        for result in generator:
            result_cnt += 1
            for sos in result["sosreports"].keys():
                log.write("{}\n".format(sos))
            outfile.write(json.dumps(result))
            outfile.write("\n")
            outfile.flush()

    scan_end = time.time()
    duration = scan_end - scan_start

    print(f"final number of records: {result_cnt:n}", flush=True)
    print(json.dumps(stats, indent=4), flush=True)
    print(f"--- merging run and result data took {duration:0.2f} seconds", flush=True)

    if memprof:
        print(
            f"Final memory profile ... {memprof.heap()}", flush=True,
        )

    return 0


# point of entry
if __name__ == "__main__":
    status = main(sys.argv)
