import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { callApi, moment, _ } from "../../index";
import { FormatMoney } from "../../../controller/Format";

function ContractPackageTypeChart(props) {
  const { dataChart = [] } = props;
  const [lineChart, setLineChart] = useState({
    series: [],
    options: {
      grid: {
        borderColor: "#f0f2f5",
      },
      fill: {
        opacity: 0.9,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          // columnWidth: '50%',
          endingShape: "rounded",
          dataLabels: { position: "top" },
        },
      },
      noData: {
        text: "Comming Soon...",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
    },
  });
  useEffect(() => {
    let data = dataChart;
    let seriesChart = data.map((x) => x.Sum);
    let cate = data.map((x) => x.Name);
    setLineChart({
      options: {
        grid: {
          borderColor: "#f0f2f5",
        },
        fill: {
          opacity: 0.9,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 5,
            columnWidth: "50%",
            dataLabels: {
              position: "center",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (value) {
            return FormatMoney(value);
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: cate,
        },
        yaxis: {
          forceNiceScale: true,
          min: 0,
          labels: {
            formatter: function (val, index) {
              return FormatMoney(val);
            },
          },
        },
        chart: {
          toolbar: { show: false },
        },
      },
      series: [{ name: "Số lượng", data: [...seriesChart] }],
    });
  }, [dataChart]);

  return (
    <div className="card-body">
      <div
        className="card-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Theo loại gói thầu</span>
      </div>
      <Chart
        options={lineChart.options}
        series={lineChart.series}
        height={320}
        type="bar"
      />
    </div>
  );
}

export default ContractPackageTypeChart;
