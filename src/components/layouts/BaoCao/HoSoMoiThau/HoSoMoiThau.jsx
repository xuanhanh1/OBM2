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
import "./index.css";
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

const HoSoMoiThau = (props) => {
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
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm dự thầu.");
      return;
    }
    if (_.isEmpty(watch().type_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn loại gói thầu.");
      return;
    }
    let year = FormatYear(watch().year);
    setLoading(true);
    callApi(
      `odata/BiddingDocuments?$Filter=year eq ${year} and type_id eq ${
        watch().type_id
      } `
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

      TITLE: `BẢNG BÁO CÁO HỒ SƠ THẦU THEO NĂM`,
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
              label="Loại gói thầu"
              name={"type_id"}
              arrayItem={`odata/MedicalSuppliestypes`}
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
                  <th>Mã gói thầu</th>
                  <th>Tên gói thầu</th>
                  <th>Loại gói thầu</th>
                  <th>Hình thức đấu thầu</th>
                  <th>Dự án</th>
                  <th>Ngày phát hành</th>
                  <th>Số quyết định</th>
                  <th>Ngày quyết định</th>
                  <th>Ngày mở thầu</th>
                  <th>Tổ chấm thầu </th>
                  <th>Tỉ lệ kỹ thuật</th>
                  <th>Tỉ lệ tài chính </th>
                  {/* <th>Năm dự thầu </th> */}
                </tr>
              </thead>
              <tbody>
                {_.map(lstReport, (item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.type_name}</td>
                      <td>{item.form_name}</td>
                      <td>{item.project}</td>
                      <td>{FormatDate(item.public_date)}</td>
                      <td>{item.decision_number}</td>

                      <td>{FormatDate(item.decision_date)}</td>
                      <td>{FormatDate(item.opening_date)}</td>
                      <td>{item.team_name}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.technical_rate}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item.financial_rate}
                      </td>
                      {/* <td>{item.year}</td> */}
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

HoSoMoiThau.propTypes = {};

export default HoSoMoiThau;
