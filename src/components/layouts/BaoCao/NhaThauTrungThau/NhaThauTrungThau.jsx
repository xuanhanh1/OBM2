import React, { useEffect, useState } from "react";
import { PageHeader, Row, Col, Button, Spin, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  moment,
  Select,
  _,
  callApi,
  Notification,
  //   MonthPicker,
} from "../../index";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  FormatMonth,
  FormatMoney,
  setValueReactFormHook,
  FormatYear,
  FormatDate,
} from "../../../controller/Format";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import font from "../../../controller/font";
import fontBold from "../../../controller/font-bold";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import "../HoSoMoiThau/index.css";
import TabPane from "antd/lib/tabs/TabPane";
import TenDanhMuc from "./TenDanhMuc";
const headerPDF = (doc, objHeader) => {
  doc.setFontSize(11);
  doc.text(`BỘ Y TẾ`, 50, 10, "center");
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 200, 10);
  doc.setFontSize(10);
  doc.text("--------oOo--------", 50, 20, null, null, "center");
  doc.setFontSize(10);
  doc.text("Độc Lập - Tự Do - Hạnh Phúc", 240, 15, null, null, "center");
  doc.text("--------oOo--------", 240, 20, null, null, "center");
  doc.setFont("Amiri-bold");
  doc.text(`BỆNH VIỆN CHỢ RẪY`, 50, 15, "center");
  doc.setFontSize(14);
  doc.setFont("Amiri-bold");
  doc.text(objHeader.TITLE, 150, 30, null, null, "center");
  doc.setFontSize(12);
  doc.setFont("Amiri-bold");
  doc.text(objHeader.DOCUMENT, 150, 40, null, null, "center");
  doc.setFontSize(9);
  //   doc.text(
  //     `Khoa phòng: ${objHeader.DEPARTMENT}`,
  //     150,
  //     35,
  //     null,
  //     null,
  //     "center"
  //   );
  //   doc.setFontSize(9);
  //   doc.text(
  //     `Tháng: ${objHeader.TUNGAY} - Tổng nhân viên: ${objHeader.NHANVIEN}
  //    `,
  //     150,
  //     40,
  //     null,
  //     null,
  //     "center"
  //   );
};

const NhaThauTrungThau = (props) => {
  const { lstRecived, isPrint } = props;

  const { t } = useTranslation();
  const {
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const [renderPdf, setRenderPdf] = useState();
  const [loading, setLoading] = useState(false);
  const [lstReport, setLstReport] = useState(lstRecived ? lstRecived : []); //
  const infoNV = JSON.parse(window.localStorage.getItem("infoNV"));
  const [disableSelect, setDisableSelect] = useState(true);
  const [printAll, setPrintAll] = useState(false);
  useEffect(() => {
    setValue("year", moment(new Date()));
  }, []);
  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu.");
      return;
    }

    setLoading(true);
    callApi(
      `odata/BidDetailByHospitals/Win?bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        setLstReport(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    handlePrint();
  }, [lstReport]);

  const handlePrint = async () => {
    var doc = new jsPDF("l", "mm", "a4");
    doc.addFileToVFS("Amiri-Regular.ttf", font);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.addFileToVFS("Amiri-Regular-bold.ttf", fontBold);
    doc.addFont("Amiri-Regular-bold.ttf", "Amiri-bold", "normal");
    doc.setFont("Amiri");
    doc.setFontSize(5);
    headerPDF(doc, {
      COMPANY: `Bệnh viện Chợ Rẫy`,
      DOCUMENT: `Tên gói thầu: ${lstReport[0].bidding_document_name}`,
      TITLE: `BẢNG BÁO CÁO NHÀ THẦU TRÚNG THẦU`,
      PACKET: ``,
    });
    var finalY = doc.lastAutoTable.finalY + 20 || 40;

    doc.autoTable({
      startY: finalY + 10,
      headStyles: {
        fillColor: [208, 215, 222],
        textColor: 0,
        font: "Amiri-bold",
        halign: "center",
      },
      html: "#table",
      useCss: true,
      columnStyles: {},
      styles: {
        font: "Amiri",
        fontStyle: "normal",
        lineColor: "black",
        lineWidth: 0.3,
        textColor: "black",
        minCellHeight: 10,
        fontSize: 10,
      },
      margin: [5, 5, 5, 5],
    });

    if (lstRecived && !_.isEmpty(lstRecived)) {
      doc.save(`Danh sách nhà thầu trúng thầu`);
    }

    if (!_.isEmpty(lstReport)) {
      if (printAll) {
        let pdf = window.open(doc.output("bloburl"), "_blank");
        setRenderPdf(pdf);
      } else {
        let pdf = doc.output("datauri");
        setRenderPdf(pdf);
      }
    } else {
      setRenderPdf("");
    }
  };
  const [lstDocument, setLstDocument] = useState([]);
  useEffect(() => {
    if (!_.isEmpty(watch().year)) {
      callApi(
        `odata/BiddingDocuments/Select?$filter=year eq ${FormatYear(
          watch().year
        )}`
      ).then((res) => {
        console.log("res", res);
        setLstDocument(res.data.value);
      });
    }
  }, [watch().year]);
  return (
    <div>
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important", marginTop: "10px" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={3}>
            <YearPickerField
              control={control}
              label="Năm"
              name={"year"}
              placeholder="Chọn năm"
              errors={errors}
            />
          </Col>
          <Col span={3}>
            <Select
              control={control}
              label="Tên gói thầu"
              name={"document_id"}
              arrayItem={lstDocument}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
            />
          </Col>

          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={loading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </div>
      </Row>

      <Tabs defaultActiveKey={1}>
        <TabPane tab={"Danh mục trúng thầu theo tên công ty"} key="1">
          <div className="gridView" id="report">
            <Spin spinning={loading}>
              {_.isEmpty(lstReport) ? (
                <h1 style={{ height: "87vh" }} className="d-flex-center">
                  Không có dữ liệu
                </h1>
              ) : (
                <embed
                  src={renderPdf}
                  type="application/pdf"
                  style={{ height: "87vh", width: "100%" }}
                ></embed>
              )}

              {!_.isEmpty(renderPdf) && loading == false ? null : (
                <table id="table" style={{ display: "none" }}>
                  <thead>
                    <tr>
                      <th>STT</th>

                      <th>Tên danh mục</th>
                      <th>Tên nhà thầu</th>
                      <th>Nhóm KT</th>
                      <th>ĐVT</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Nơi sản xuất</th>

                      <th>SN chấm</th>
                      <th>Điểm TB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lstRecived &&
                      lstRecived.length > 0 &&
                      _.map(lstRecived, (item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>

                            <td>{item.medical_supplies_name_byt}</td>
                            <td>{item.bidder_name}</td>
                            <td>{}</td>
                            <td>{}</td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              {FormatMoney(item.quantity)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {FormatMoney(item.price)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {FormatMoney(item.price)}
                            </td>
                            <td>{}</td>

                            <td>{item.sum_marker}</td>
                            <td>{item.avg_technical_mark}</td>
                          </tr>
                        );
                      })}
                    {_.map(lstReport, (item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          <td>{item.medical_supplies_name_byt}</td>
                          <td>{item.bidder_name}</td>
                          <td>{}</td>
                          <td>{}</td>
                          <td style={{ textAlign: "right" }}>
                            {" "}
                            {FormatMoney(item.quantity)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {FormatMoney(item.price)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {FormatMoney(item.price)}
                          </td>
                          <td>{}</td>

                          <td>{item.sum_marker}</td>
                          <td>{item.avg_technical_mark}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Spin>
          </div>
        </TabPane>
        <TabPane tab="Danh mục trúng thầu theo tên mời thầu" key="2">
          <TenDanhMuc lstRecived22={lstReport}> </TenDanhMuc>
        </TabPane>
      </Tabs>
    </div>
  );
};

NhaThauTrungThau.propTypes = {};

export default NhaThauTrungThau;
