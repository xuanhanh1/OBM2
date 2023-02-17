import React, { useEffect, useState } from "react";
import { PageHeader, Row, Col, Button, Spin } from "antd";
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

const DMKhongNhaThau = (props) => {
  const { lstRecived } = props;
  console.log("lstRecived", lstRecived);
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
  const [lstDocument, setLstDocument] = useState([]);
  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu.");
      return;
    }

    setLoading(true);
    callApi(
      `odata/BiddingDocumentDetails/NotBid?$Filter=bidding_document_id eq ${
        watch().document_id
      }`
    )
      .then((res) => {
        console.log("res.data.value.bids", res.data.value);
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

      TITLE: `DANH MỤC KHÔNG CÓ NHÀ THẦU DỰ THẦU`,
      DOCUMENT: `Tên gói thầu: ${lstReport[0].bidding_document_name}`,
      YEAR: `DANH MỤC KHÔNG CÓ NHÀ THẦU`,
    });
    var finalY = doc.lastAutoTable.finalY + 20 || 40;

    doc.autoTable({
      startY: finalY + 20,
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

                  <th>Mã mời thầu</th>
                  <th>Tên BYT</th>
                  <th>Đơn giá kế hoạch</th>
                  <th>Số lượng</th>
                  <th>Cách đánh giá về KT</th>
                  <th>Tính năng KT</th>
                  <th>Tiền ĐBDT</th>
                  <th>Tỉ lệ ĐBDT</th>
                  <th>Đơn giá dự kiến</th>
                  <th>Số lượng dự kiến</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {_.map(lstReport, (item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      {/* <td>{item.bidding_document_name} </td> */}
                      <td>{item.medical_supplies_code_bv} </td>
                      <td>{item.medical_supplies_name_byt}</td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.plan_price)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.quantity)}
                      </td>
                      <td>{item.technical_evaluation_type_name}</td>
                      <td>{item.technical_features} </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.bid_security_money)}{" "}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {item.bid_security_rate}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.plan_price)}
                      </td>
                      <td style={{ textAlign: "right" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>
                        {FormatMoney(item.plan_price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Spin>
      </div>
    </div>
  );
};

DMKhongNhaThau.propTypes = {};

export default DMKhongNhaThau;
