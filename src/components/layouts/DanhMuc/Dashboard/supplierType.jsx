import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Drawer, Spin, Divider } from "antd";
import { callApi, DataGrid } from "../../index";
import PropTypes from "prop-types";
function SupplierType(props) {
  const { dataChart = [] } = props;
  const [lineChart, setLineChart] = useState({
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
        id: "chart-thietbisuachua",
        // events: {
        //     dataPointSelection: function (event, chartContext, config) {
        //         if (event.button !== 0) return; //click right button
        //         const ten_KP = config.w.config.xaxis.categories[config.dataPointIndex];
        //         setSelectedKP(ten_KP);
        //         setIsVisible(true);
        //         callApi(`odata/trangthietbis?$filter=TEN_TRANGTHAI eq 'Đang sửa chữa' and TEN_KP eq '${ten_KP}'`, 'GET')
        //             .then(res => {
        //                 const data = res.data.value;
        //                 setListTTB(data);
        //             })
        //         // console.log(config.w.config.series[0].data[config.dataPointIndex]);
        //     }
        // },
      },
    },
    series: [],
  });

  useEffect(() => {
    let data = dataChart;
    let seriesChart = data.map((x) => x.Count);
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
            startingShape: "rounded",
            endingShape: "rounded",
            borderRadius: 5,
            columnWidth: "20%",
            dataLabels: {
              position: "center", // top, center, bottom
            },
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
              return val.toFixed(0);
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
    <React.Fragment>
      <div className="card-body">
        <div className="card-title">Theo loại nhà cung cấp</div>
        <Chart
          options={lineChart.options}
          series={lineChart.series}
          height={320}
          type="bar"
        />
      </div>
    </React.Fragment>
  );
}

export default SupplierType;
