import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { FormatYear } from "../../../controller/Format";
import { callApi, _ } from "../../index";
function OrderSupplier(props) {
  const [dataChart, setDataChart] = useState([]);
  const [lineChart, setLineChart] = useState({
    series: [
      {
        data: [21, 22, 10, 28, 16, 21, 13, 30],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      // colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          ["John", "Doe"],
          ["Joe", "Smith"],
          ["Jake", "Williams"],
          "Amber",
          ["Peter", "Brown"],
          ["Mary", "Evans"],
          ["David", "Wilson"],
          ["Lily", "Roberts"],
        ],
        labels: {
          style: {
            // colors: colors,
            fontSize: "12px",
          },
        },
      },
    },
  });
  useEffect(() => {
    let today = new Date();
    let year = FormatYear(today);
    callApi(`api/Dashboard/GetBidDetailByStatus?year=${year}`, "GET").then(
      (res) => {
        setDataChart(res.data);
      }
    );
  }, []);
  const getApi = () => {
    let sum = dataChart.map((x) => x.sum);
    let name = dataChart.map((x) => x.name);
    setLineChart({
      series: [
        {
          data: sum,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        // colors: colors,
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: name,
          labels: {
            style: {
              // colors: colors,
              fontSize: "12px",
            },
          },
        },
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
        <span>Số chi tiết dự thầu theo trạng thái</span>
      </div>

      <Chart
        options={lineChart.options}
        series={lineChart.series}
        height={360}
        type="bar"
      />
    </div>
  );
}

export default OrderSupplier;
