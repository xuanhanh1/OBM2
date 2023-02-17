import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { callApi, moment, _ } from "../../index";
import { FormatMoney } from "../../../controller/Format";
import { FormatYear } from "../../../controller/Format";
function RequestPaymentDebtChart(props) {
  const [dataChart, setDataChart] = useState([]);
  const [lineChart, setLineChart] = useState({
    series: [76, 67, 61, 90],
    options: {
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          vertical: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    let today = new Date();
    let year = FormatYear(today);
    callApi(`api/Dashboard/GetBidByStatus?year=${year}`, "GET").then((res) => {
      setDataChart(res.data);
    });
  }, []);
  const getApi = () => {
    let sum = dataChart.map((x) => x.sum);
    let name = dataChart.map((x) => x.name);
    setLineChart({
      series: sum,
      options: {
        chart: {
          height: 390,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "30%",
              background: "transparent",
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
        labels: name,
        legend: {
          show: true,
          floating: true,
          fontSize: "16px",
          position: "left",
          offsetX: 160,
          offsetY: 15,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0,
          },
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          itemMargin: {
            vertical: 3,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      },
    });
  };
  useEffect(() => {
    getApi();
  }, [dataChart]);

  return (
    <div className="card-body">
      <div
        className="card-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Số hồ sơ dự thầu theo trạng thái</span>
      </div>
      <Chart
        options={lineChart.options}
        series={lineChart.series}
        height={423}
        type="radialBar"
      />
    </div>
  );
}

export default RequestPaymentDebtChart;
