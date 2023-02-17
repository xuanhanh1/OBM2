import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { callApi, moment, _ } from "../../index";
import { DatePicker } from "antd";
import { FormatMoney } from "../../../controller/Format";
function CheckoutChart(props) {
  const { dataChart = [] } = props;
  const [lineChart, setLineChart] = useState({
    options: {
      grid: {
        borderColor: "#f0f2f5",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 2,
        strokeWidth: 3,
      },
      stroke: {
        curve: "smooth",
        width: 5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        x: {
          show: true,
          formatter: (value) => "Tháng " + value,
        },
        y: {
          show: true,
          formatter: (value) => FormatMoney(value) + " VNĐ",
        },
      },
      noData: { text: "Loading..." },
    },
    series: [],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setSelectedYear(new Date().getFullYear());
  }, []);
  const getApi = (year) => {
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
      setLineChart({
        ...lineChart,
        options: { ...lineChart.options, noData: { text: "Không có dữ liệu" } },
        series: [],
      });
      return;
    }
    setLineChart({
      ...lineChart,
      options: { ...lineChart.options, noData: { text: "Loading..." } },
      series: [],
    });
    callApi(`api/Dashboard/GetSumMoneyGroupbyMonth/${year}`, "GET")
      .then((res) => {
        let data = res.data;
        if (_.isEmpty(data[0].Sum)) {
          setLineChart({
            ...lineChart,
            options: {
              ...lineChart.options,
              noData: { text: "Không có dữ liệu" },
            },
            series: [],
          });
        } else {
          let seriesChart = data.map((x) => {
            return { name: x.Name, data: x.Sum };
          });
          setLineChart({ ...lineChart, series: seriesChart });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  useEffect(() => {
    let data = dataChart;
    if (data.length === 0) {
      return;
    }
    if (_.isEmpty(data[0].Sum)) {
      setLineChart({
        ...lineChart,
        options: {
          ...lineChart.options,
          noData: { text: "Không có dữ liệu" },
        },
        series: [],
      });
    } else {
      let seriesChart = data.map((x) => {
        return { name: x.Name, data: x.Sum };
      });
      setLineChart({ ...lineChart, series: seriesChart });
    }
  }, [dataChart]);

  useEffect(() => {
    getApi(selectedYear);
  }, [selectedYear]);
  const onChange = (date, dateString) => {
    if (dateString === "") return;
    setSelectedYear(dateString);
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };
  return (
    <div className="card-body">
      <div
        className="card-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Công nợ theo tháng</span>
        <DatePicker
          onChange={onChange}
          picker="year"
          placeholder="Năm"
          style={{ width: "100px" }}
          defaultValue={moment(new Date())}
          allowClear={false}
          disabledDate={disabledDate}
        />
      </div>
      <Chart
        options={lineChart.options}
        series={lineChart.series}
        height={320}
        type="area"
      />
    </div>
  );
}

export default CheckoutChart;
