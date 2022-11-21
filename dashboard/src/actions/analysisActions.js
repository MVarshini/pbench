import * as TYPES from "./types";

export const getTestNames = () => (dispatch) => {
  const testNames = ["Test1", "Test2", "Test3"];

  dispatch({
    type: TYPES.GET_TESTS_NAMES,
    payload: testNames,
  });
};

export const downloadFile = (type) => {};
export const drawChart = () => async (dispatch) => {
  const res = await fetch("https://api.coincap.io/v2/assets/?limit=5");
  const data = await res.json();
  const chartData = {
    labels: ["-8i", "1i", "8i", "16i", "24i"],
    datasets: [
      {
        label: "Instance Count",
        data: data.data.map((crypto) => crypto.priceUsd),
        backgroundColor: [
          "#ffbb11",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
      },
    ],
  };
  dispatch({
    type: TYPES.SET_CHART_DATA,
    payload: chartData,
  });
};
export const getChartData = () => (dispatch) => {
  const data = {
    data: [
      {
        vm_name: "e2-medium",
        test_name: "tcp_stream64B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i-fail1",
            status: "",
            time_taken: " 0.2472",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 0.2844",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 0.2889",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_stream1024B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 1.9460",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 1.8440",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 1.6650",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_stream8192B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 1.9660",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 1.9650",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 1.9650",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr64B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  8369.0000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 37200.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 41100.0000",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr64B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 120.4000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 229.6000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 395.2000",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr1024B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  6913.0000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 36020.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 36700.0000",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr1024B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 145.3000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 240.1000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 443.9000",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr8192B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  5674.0000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 23150.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 17950.0000",
          },
        ],
      },
      {
        vm_name: "e2-medium",
        test_name: "tcp_rr8192B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 177.8000",
          },
          {
            name: "8i-fail1",
            status: "",
            time_taken: " 377.8000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 913.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_stream64B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  0.5584",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  4.7230",
          },
          {
            name: "16i",
            status: "",
            time_taken: "  8.9610",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_stream1024B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  5.9720",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 31.8300",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 31.8100",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_stream8192B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 23.3100",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 31.9600",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 31.9700",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr64B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  19520.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 131500.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 207300.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr64B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  51.4400",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  60.8800",
          },
          {
            name: "16i",
            status: "",
            time_taken: "  77.2200",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr1024B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  16930.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 115800.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 182000.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr1024B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  59.5400",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  69.1700",
          },
          {
            name: "16i",
            status: "",
            time_taken: "  87.9300",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr8192B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  13550.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  77050.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 126200.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-64",
        test_name: "tcp_rr8192B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  73.9600",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 103.9000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 126.8000",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_stream64B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  1.2620",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  9.0010",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 17.8700",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_stream1024B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 13.0800",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 31.8900",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 31.9600",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_stream8192B",
        metrics_unit: "Gb_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: " 29.2900",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 31.9700",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 31.9700",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr64B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  24870.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 163800.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 273800.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr64B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  40.3000",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  48.8700",
          },
          {
            name: "16i",
            status: "",
            time_taken: "  58.4500",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr1024B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  20820.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: " 142000.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 241500.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr1024B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  48.2700",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  56.4600",
          },
          {
            name: "16i",
            status: "",
            time_taken: "  66.2800",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr8192B",
        metrics_unit: "trans_sec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  14700.0000",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  93730.0000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 153600.0000",
          },
        ],
      },
      {
        vm_name: "n2-standard-128",
        test_name: "tcp_rr8192B",
        metrics_unit: "usec",
        instances: [
          {
            name: "1i",
            status: "",
            time_taken: "  68.1500",
          },
          {
            name: "8i",
            status: "",
            time_taken: "  85.4000",
          },
          {
            name: "16i",
            status: "",
            time_taken: " 104.2000",
          },
        ],
      },
    ],
  };
  dispatch({
    type: TYPES.GET_TEST_DATA,
    payload: data,
  });
};
