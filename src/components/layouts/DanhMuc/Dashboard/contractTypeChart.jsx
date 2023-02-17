import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { callApi } from "../../index";

function ContractTypeChart(props) {
  const { dataChart = [] } = props;
  const [lineChart, setLineChart] = useState({
    series: [],
    options: {
      labels: [],
      legend: {
        position: "top",
        horizontalAlign: "right",
        onItemClick: { toggleDataSeries: true },
        onItemHover: { highlightDataSeries: true },
      },
    },
  });
  // useEffect(() => {
  //     callApi(`api/Dashboard/GetCountContractGroupbyType`, "GET")
  //         .then(res => {
  //             let data = res.data;
  //             let seriesChart = data.map(x => x.Count);
  //             let type = data.map(x => x.Name);
  //             setLineChart({
  //                 ...lineChart, series: seriesChart,
  //                 options: {
  //                     labels: [...type],
  //                     legend: {
  //                         position: 'bottom', horizontalAlign: 'center', onItemClick: { toggleDataSeries: true }, onItemHover: { highlightDataSeries: true }
  //                     },
  //                 }
  //             })
  //         })
  //         .catch(err => { console.log(err); });
  // }, [])
  useEffect(() => {
    let data = dataChart;
    let seriesChart = data.map((x) => x.Count);
    let type = data.map((x) => x.Name);
    setLineChart({
      ...lineChart,
      series: seriesChart,
      options: {
        labels: [...type],
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          onItemClick: { toggleDataSeries: true },
          onItemHover: { highlightDataSeries: true },
        },
      },
    });
  }, [dataChart]);
  return (
    <div className="card-body">
      <div className="card-title">Theo loại hợp đồng</div>
      <ReactApexChart
        options={lineChart.options}
        series={lineChart.series}
        height="367"
        type="donut"
      />
    </div>
  );
}

export default ContractTypeChart;
