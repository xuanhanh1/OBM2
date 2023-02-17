import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { callApi } from "../../index";
import { FormatYear } from "../../../controller/Format";
function RequestPaymentStatusChart(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataChart, setDataChart] = useState([]);
  const [lineChart, setLineChart] = useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    let today = new Date();
    let year = FormatYear(today);
    callApi(
      `api/Dashboard/GetBiddingDocumentByStatus?year=${year}`,
      "GET"
    ).then((res) => {
      setDataChart(res.data);
    });
  }, []);

  useEffect(() => {
    let data = dataChart;
    let sum = data.map((x) => x.sum);
    let name = data.map((x) => x.name);
    setLineChart({
      // options: { ...lineChart, xaxis: { categories: arrayStatus } },
      // series: [{ type: "column", name: "Số lượng", data: [...seriesChart] }],
      series: sum,
      options: {
        chart: {
          type: "donut",
        },
        labels: name,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                // width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [dataChart]);
  return (
    <React.Fragment>
      <div className="card-body">
        <div className="card-title">Số hồ sơ mời thầu theo trạng thái</div>
        <Chart
          options={lineChart.options}
          series={lineChart.series}
          height={400}
          type="donut"
        />
      </div>
    </React.Fragment>
  );
}

export default RequestPaymentStatusChart;
