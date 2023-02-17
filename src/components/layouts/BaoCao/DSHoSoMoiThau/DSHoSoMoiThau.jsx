import React, { useEffect, useState } from "react";
import { PageHeader, Row, Col, Button, Spin, Descriptions, Space } from "antd";
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
const headerPDF = (doc, objHeader) => {
  doc.setFontSize(11);
  doc.text(`BỘ Y TẾ`, 50, 20, "center");
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 200, 20);
  doc.setFontSize(10);
  doc.text("--------oOo--------", 50, 30, null, null, "center");
  doc.setFontSize(10);
  doc.text("Độc Lập - Tự Do - Hạnh Phúc", 240, 25, null, null, "center");
  doc.text("--------oOo--------", 240, 30, null, null, "center");
  doc.setFont("Amiri-bold");
  doc.text(`BỆNH VIỆN CHỢ RẪY`, 50, 25, "center");
  doc.setFontSize(14);
  doc.setFont("Amiri-bold");
  doc.text(objHeader.TITLE, 150, 55, null, null, "center");
  doc.setFontSize(9);
  //   --------------------------
  doc.setFontSize(12);
  doc.setFont("Amiri");
  doc.text(objHeader.DOCUMENT, 50, 70, null, null); //TÊN GÓI THẦU
  doc.text(objHeader.BIDDER, 50, 80, null, null); //TÊN NHÀ THẦU
  doc.text(objHeader.BIDDERSHORT, 50, 90, null, null); //TÊN NHÀ THẦU
  doc.text(objHeader.DATE, 50, 100, null, null); //NGÀY MUA
  doc.text(objHeader.BUYER, 50, 110, null, null); //NGƯỜI MUA MUA
  doc.text(objHeader.ORDER, 50, 120, null, null); //NGƯỜI MUA MUA
  doc.text(objHeader.Link, 50, 130, null, null); //NGƯỜI MUA MUA
  doc.text(objHeader.USER, 50, 140, null, null); //TÊN ĐĂNG NHẬP
  doc.text(objHeader.PASSWORD, 50, 150, null, null); //TÊN ĐĂNG NHẬP
};

const DSHoSoMoiThau = (props) => {
  const { lstRecived } = props;
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

  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu.");
      return;
    }

    setLoading(true);
    callApi(
      `odata/BiddingDocuments?$Filter=id eq ${watch().document_id}&$Expand=bids`
    )
      .then((res) => {
        setLstReport(res.data.value[0].bids);
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
      TITLE: `THÔNG TIN NHÀ THẦU MUA HỒ SƠ THẦU`,
      DOCUMENT: `Tên gói thầu: ${lstRecived.bidding_document_name}`,
      BIDDER: `Tên nhà thầu: ${lstRecived.bidder_name}`,
      BIDDERSHORT: `Tên nhà thầu viết tắt : ${lstRecived.bidder_shortcut_name}`,
      DATE: `Ngày mua: ${FormatDate(lstRecived.buy_date)}`,
      BUYER: `Người mua: ${lstRecived.buyer}`,
      ORDER: `Thứ tự: ${lstRecived.order}`,
      Link: `Liên kết: obm.tekmedi.com/nha-thau/ho-so-du-thau`,
      USER: `Tên đăng nhập: ${lstRecived.bidder_username}`,
      PASSWORD: `Mật khẩu: ******`,
    });
    var finalY = doc.lastAutoTable.finalY + 20 || 30;

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
      doc.save(`Thông tin nhà thầu `);
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
  useEffect(() => {
    setValue("year", moment(new Date()));
  }, []);
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
          {" "}
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
              <Space size={24}>
                <Descriptions
                  bordered
                  size="small"
                  style={{
                    marginBottom: "10px",
                    marginTop: "10px",
                    marginLeft: "30px",
                    justifyContent: "center",
                  }}
                >
                  <Descriptions.Item label={"Tên nhà thầu"} span={3}>
                    <b>{lstRecived.bidder_name}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Tên trên bao bì"} span={1}>
                    <b>{lstRecived.packing_name}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Số lượng"} span={1}>
                    <b>{lstRecived.quantity}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Đơn giá"} span={1}>
                    <b>{FormatMoney(lstRecived.price)}</b>
                  </Descriptions.Item>

                  <Descriptions.Item label={"Đơn giá kê khai"} span={1}>
                    <b>{FormatMoney(lstRecived.public_price)}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Quy cách"} span={1}>
                    <b>{lstRecived.specification}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Hạn dùng (Tháng)"} span={1}>
                    <b>{lstRecived.expiry}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Nhà sản xuất"} span={1}>
                    <b>{lstRecived.producer}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Xuất xứ"} span={1}>
                    <b>{lstRecived.origin}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"GPLHSP hoặc GPNK"} span={1}>
                    <b>{lstRecived.license}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Nhóm TCKT"} span={1}>
                    <b>{lstRecived.technical_criteria_group_name}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label={"Điểm nhà thầu chấm"} span={1}>
                    <b>{lstRecived.bidder_technical_mark}</b>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </table>
          )}
        </Spin>
      </div>
    </div>
  );
};

DSHoSoMoiThau.propTypes = {};

export default DSHoSoMoiThau;
