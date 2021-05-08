#!/bin/bash

# Intended to be run inside a pbench-agent container

export pbench_run=/var/lib/pbench-agent
export PBENCH_ORCHESTRATE=existing

set -x

# Register the default tool set, will be recorded in
# ${pbench_run}/tools-v1-default
for tool in vmstat mpstat jaeger; do
    printf -- "\npbench-register-tool --name=${tool} --remotes=@${pbench_run}/remotes.lis\n"
    pbench-register-tool --name=${tool} --remotes=@${pbench_run}/remotes.lis
done

pbench-user-benchmark --config="my-config-001" --iteration-list=${pbench_run}/my-iterations.lis --sysinfo=none -- sleep 10

set +x
