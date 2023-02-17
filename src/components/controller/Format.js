const moment = require("moment");
const _ = require("lodash");
const antd = require("antd");
const font = require("./font");
const fontBold = require("./font-bold");
// const jsPDF = require("jspdf");
const readVND = require("read-vietnamese-number");
const { Avatar, Checkbox } = antd;
var result = [];
// var getDaysArray = function (year = 2021, month = 1) {
//   var monthIndex = month - 1;
//   var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   var date = new Date(year, monthIndex, 1);
//   let result = [];
//   while (date.getMonth() == monthIndex) {
//     result.push({
//       value: moment(
//         `${date.getDate()}/${month}/${year}`,
//         "DD/MM/yyyy"
//       ).format("DD/MM/yyyy HH:mm"),
//       title: names[date.getDay()] + ", " + date.getDate(),
//     });
//     date.setDate(date.getDate() + 1);
//   }
//   console.log(result);
//   return result;
// };

const setStateForPeriod = (periodName, value1, value2) => {
  const result =
    periodName === "week"
      ? {
          period: periodName,
          formDate: moment(`${moment().year()}`)
            .add(value1, "weeks")
            .subtract(7, "days"),
          toDate: moment(`${moment().year()}`)
            .add(value1, "weeks")
            .endOf("days"),
        }
      : {
          period: periodName,
          formDate: moment(`${moment().year()}-${value1}-01`).startOf("month"),
          toDate: moment(`${moment().year()}-${value2}-01`).endOf("month"),
        };
  return result;
};

const FormatMoney = (money) => {
  return parseInt(money)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    .toString();
};

const FormatDate = (date) => {
  if (typeof date === "undefined") {
    return " ";
  }
  return moment(date).format("DD/MM/YYYY");
};
const FormatDateTime = (date) => {
  if (_.isUndefined(date) || _.isEmpty(date)) {
    return "";
  }
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};

const FormatMonth = (date) => {
  if (typeof date === "undefined") {
    return " ";
  }
  return moment(date).format("MM/YYYY");
};
const FormatYear = (date) => {
  if (typeof date === "undefined") {
    return " ";
  }
  return moment(date).format("YYYY");
};

//Format property name object thành chữ thường
const toLowerPropertyName = (object) => {
  var key,
    keys = Object.keys(object);
  var n = keys.length;
  var newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = object[key];
  }
  return newobj;
};
//Format property name object thành chữ in
const toUpperPropertyName = (object) => {
  for (var key in object) {
    var upper = key.toUpperCase();
    if (upper !== key) {
      object[upper] = object[key];
      delete object[key];
    }
  }
  return object;
};

//Format property name object array thành chữ in
const toUpperPropertyNameByArray = (array) => {
  if (!_.isEmpty(array)) {
    _.filter(array, (item) => {
      for (var key in item) {
        var upper = key.toUpperCase();
        if (upper !== key) {
          item[upper] = item[key];
          delete item[key];
        }
      }
    });
  }
  return array;
};

//Format property name object array thành chữ thường
const toLowerPropertyNameByArray = (array) => {
  if (!_.isEmpty(array)) {
    _.filter(array, (item) => {
      for (var key in item) {
        var upper = key.toLowerCase();
        if (upper !== key) {
          item[upper] = item[key];
          delete item[key];
        }
      }
    });
  }
  return array;
};
const onPeriodChange = (value, inputNumber = 0) => {
  switch (value) {
    case "q1": {
      return setStateForPeriod(value, "01", "03");
    }
    case "q2": {
      return setStateForPeriod(value, "04", "06");
    }
    case "q3": {
      return setStateForPeriod(value, "07", "09");
    }
    case "q4": {
      return setStateForPeriod(value, "10", "12");
    }
    case "d6t": {
      return setStateForPeriod(value, "01", "06");
    }
    case "c6t": {
      return setStateForPeriod(value, "07", "12");
    }
    case "cn": {
      return setStateForPeriod(value, "01", "12");
    }
    case "formTo": {
      return setStateForPeriod(value, "01", "12");
    }
    case "week": {
      return setStateForPeriod(value, inputNumber);
    }
    default: {
      return setStateForPeriod(value, value, value);
    }
  }
};

const FormatColumnTable = (objectColumn) => {
  result.length = 0;
  Object.keys(objectColumn).map((itemColumn) => {
    result.push({
      title: objectColumn[itemColumn].name,
      dataIndex: itemColumn,
      key: itemColumn,
      width: objectColumn[itemColumn].width,
      render: (value, row, index) => {
        return objectColumn[itemColumn].formatDate ? (
          `${FormatDate(value)}`
        ) : objectColumn[itemColumn].formatMoney ? (
          `${FormatMoney(value)}`
        ) : objectColumn[itemColumn].formatImage ? (
          <Avatar shape="square" src={"data:image/png;base64," + value} />
        ) : objectColumn[itemColumn].checkBox ? (
          <Checkbox checked={value} disabled={true} />
        ) : (
          value
        );
      },
    });
  });
};

const onPrintPdf = (doc, objPdf) => {
  // {
  //   COMPANY:"",
  //   ADDRESS:"",
  //   TITLE:"",
  //   THOIGIAN:"",
  //   DONVI:"",
  //   LISTITEM:"",
  //   COLUMNSREPORT:"",
  //   MAPHIEU:"",
  //   DONVI:"",
  //   FILENAME:"",
  // }
  doc.setFontSize(11);
  doc.text(`${objPdf.COMPANY}`, 20, 10);
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 110, 10);
  doc.setFontSize(10);
  doc.text(`Địa chỉ:${objPdf.ADDRESS}`, 20, 15);
  doc.text("--------oOo--------", 40, 20, null, null, "center");
  doc.setFontSize(10);
  doc.text("Độc Lập - Tự Do - Hạnh Phúc", 150, 15, null, null, "center");
  doc.text("--------oOo--------", 150, 20, null, null, "center");
  doc.setFontSize(14);
  doc.text(objPdf.TITLE, 100, 30, null, null, "center");
  doc.setFontSize(9);
  doc.text(
    `Ngày ${FormatDate(objPdf.THOIGIAN)}`,
    100,
    35,
    null,
    null,
    "center"
  );
  doc.autoTable({
    startY: 43,
    headStyles: { fillColor: [208, 215, 222], textColor: 0 },
    body: objPdf.LISTITEM,
    columns: objPdf.COLUMNSREPORT,
    styles: {
      font: "Amiri",
      fontStyle: "normal",
      lineColor: "black",
      lineWidth: 0.3,
      textColor: "black",
    },
    margin: [10, 10, 10, 10],
  });
  doc.setFont("Amiri-bold");
  doc.setFontSize(8);
  doc.text(`PSC: ${objPdf.MAPHIEU}`, 160, doc.lastAutoTable.finalY + 5);
  doc.setFontSize(10);
  doc.text(
    `TP.Hồ Chí Minh, ngày....... tháng....... năm.......`,
    120,
    doc.lastAutoTable.finalY + 20
  );
  doc.text(`Đại diện ${objPdf.DONVI}`, 135, doc.lastAutoTable.finalY + 25);
  doc.save(`${objPdf.FILENAME}.pdf`);
};

// const Upload = () => {
//   const fileUpload = document.getElementById("fileUpload");
//   const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
//   let data = [];
//   if (regex.test(fileUpload.value.toLowerCase())) {
//     let fileName = fileUpload.files[0].name;
//     if (typeof FileReader !== "undefined") {
//       const reader = new FileReader();
//       if (reader.readAsBinaryString) {
//         reader.onload = async (e) => {
//           var promise = new Promise((res, rej) => {
//             let dataExcel = processExcel(reader.result);
//           });
//         };
//         reader.readAsBinaryString(fileUpload.files[0]);
//       }
//     } else {
//       return 1;
//     }
//   } else {
//     return 2;
//   }
// };

// function processExcel(data) {
//   const workbook = XLSX.read(data, { type: "binary" });
//   const firstSheet = workbook.SheetNames[0];
//   var worksheet = workbook.Sheets[firstSheet];
//   var headers = {};
//   var data = [];
//   for (var z in worksheet) {
//     if (z[0] === "!") continue;
//     //parse out the column, row, and value
//     var tt = 0;
//     for (var i = 0; i < z.length; i++) {
//       if (!isNaN(z[i])) {
//         tt = i;
//         break;
//       }
//     }
//     var col = z.substring(0, tt);
//     var row = parseInt(z.substring(tt));
//     var value = worksheet[z].v;

//     //store header names
//     if (row == 1 && value) {
//       headers[col] = value;
//       continue;
//     }

//     if (!data[row]) data[row] = {};
//     data[row][headers[col]] = value;
//   }
//   data.shift();
//   data.shift();
//   return data;
// }

//Hàm set default value khi component được mount (sử dụng khi edit item)
//Nếu value là time, dùng moment format value trước khi chạy.
function setValueReactFormHook(obj, setValue) {
  for (var propertyName in obj) {
    setValue(propertyName, obj[propertyName]);
  }
}

//Hàm đọc tiền số thành chữ
const onReadVND = (money) => {
  const config = new readVND.ReadingConfig();
  config.unit = ["đồng"];
  const number = readVND.parseNumberData(
    config,
    parseInt(money)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1")
      .toString()
  );
  return (
    readVND.readNumber(config, number).charAt(0).toUpperCase() +
    readVND.readNumber(config, number).slice(1)
  );
};
export {
  FormatMoney,
  FormatDate,
  FormatMonth,
  FormatYear,
  toLowerPropertyName,
  toUpperPropertyName,
  toUpperPropertyNameByArray,
  onPeriodChange,
  FormatColumnTable,
  toLowerPropertyNameByArray,
  FormatDateTime,
  result,
  // Upload,
  setValueReactFormHook,
  onPrintPdf,
  onReadVND,
};
