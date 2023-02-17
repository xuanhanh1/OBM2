import { Button, Col, Modal, Row, Tabs, Spin } from "antd";
import { CSVDownload } from "react-csv";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ExclamationCircleFilled } from "@ant-design/icons";
import "./index.css";

import { _, callApi, UploadFile } from "../../../index";

import PropTypes from "prop-types";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import DataGridTCKTExcel from "../../../../../common/control/dataGridTCKTExcel";

const { confirm } = Modal;

function ModalImportExcel(props) {
  const {
    objEdit,
    columns,

    lstPickExcel,
    lstTechnicalEvaluationTypes,
    setVisible,
    typeId,
    modalId,
  } = props;

  //Các danh sách select option
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);

  const [respone, setRespone] = useState(false);
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoadingExcel, setIsLoading] = useState(false);
  const [lst, setLst] = useState(lstPickExcel);
  const [dataRespone, setDataRespone] = useState([]);
  const [technicalCriteriaGroups, setTechnicalCriteriaGroups] = useState([]);

  const selectedRow = (params) => {};

  const selectedRowTCKT = (params) => {};

  const handleRowChange = (e) => {};

  useEffect(() => {
    if (lstPickExcel.length > 0) {
      setLst(lstPickExcel);
      setLoading(false);
    } else {
    }
  }, [lstPickExcel]);

  useEffect(() => {
    callApi(`odata/TechnicalCriteriaGroups`, "GET").then((res) => {
      setTechnicalCriteriaGroups(res.data.value);
    });
  }, []);

  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0]?.originFileObj);
    setFileExcel(formData);
  };

  const handleUploadFile = () => {
    setIsLoading(true);
    if (modalId === "866c83e5-2edd-4f26-bfd4-0b0a4694319c") {
      //2 giai doan 2 tui ho so
      callApi(
        `odata/BidDetails/ImportExcelKoGia?bid_id=${objEdit.id}`,
        "POST",
        isFileExcel,
        "multipart/form-data"
      )
        .then((res) => {
          openNotificationWithIcon("success", "Thêm file thành công");
          setLst(res.data);
          setIsLoading(false);
          setVisible(false);
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response.data && err.response.data.length > 0) {
            setDataRespone(err.response.data);
            setRespone(true);
          } else {
            openNotificationWithIcon("warning", err.response.data.errors[0]);
          }
        });
    } else {
      //1 giai doan 2 tui ho so
      callApi(
        `odata/BidDetails/ImportExcel?bid_id=${objEdit.id}`,
        "POST",
        isFileExcel,
        "multipart/form-data"
      )
        .then((res) => {
          openNotificationWithIcon("success", "Thêm file thành công");
          setLst(res.data);
          setIsLoading(false);
          setVisible(false);
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response.data && err.response.data.length > 0) {
            setDataRespone(err.response.data);
            setRespone(true);
          } else {
            openNotificationWithIcon("warning", err.response.data.errors[0]);
          }
        });
    }
  };

  const showConfirm = () => {
    confirm({
      title: "Bạn có muốn cập nhật lại toàn bộ danh mục không?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleUploadFile();
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Row gutter={[8, 0]}>
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
            backgroundColor: "#fff",
            marginBottom: "10px",
            paddingLeft: "10px",
          }}
        >
          <Col span={4}>
            <UploadFile
              label="File danh mục"
              listFile={listFileUpload}
              maxCount={1}
              fileType={[".xlsx", ".xlsm", ".xls"]}
            />
          </Col>
          <Col span={4}>
            {" "}
            <Button
              onClick={showConfirm}
              type="primary"
              disabled={_.isNull(isFileExcel)}
              loading={isLoadingExcel}
              style={{ marginTop: 22 }}
            >
              Cập nhật danh mục
            </Button>
          </Col>
        </div>
      </Row>
      <Spin spinning={isLoading}>
        <div
          className="gridView gridViewBHXH"
          style={{ height: "calc(100vh - 300px)" }}
        >
          <DataGridTCKTExcel
            data={lst}
            data2={lstTechnicalEvaluationTypes}
            data3={technicalCriteriaGroups}
            dataKey={"medical_supplies_code_bv"}
            showFilterRow={true}
            exportExcel={false}
            typeId={typeId}
            modalId={modalId}
          />
        </div>
      </Spin>
      {respone ? (
        <CSVDownload data={dataRespone} target="_blank" filename={"File lỗi"} />
      ) : null}
    </div>
  );
}

ModalImportExcel.propTypes = {
  columns: PropTypes.array,
  columnsChoice: PropTypes.array,
  ModalImportExcel: PropTypes.object,
};
ModalImportExcel.defaultProps = {
  columns: [
    {
      caption: "Mã thuốc vật tư",
      dataField: "medical_supplies_code_bv",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Nhóm tiêu chí đánh giá",
      dataField: "technical_evaluation_type_name",
      type: 0,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      format: "number",
    },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tỉ lệ đảm bảo dự thầu",
      dataField: "bid_security_rate",
      type: 0,
      format: "number",
    },
    {
      caption: "Tiền đảm bảo dự thầu",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tính năng kỹ thuật",
      dataField: "technical_features",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
  columnsChoice: [
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 1,
    },
    {
      caption: "Tên thương mại",
      dataField: "medical_supplies_name_byt",
      type: 1,
    },
    {
      caption: "Tên trên bao bì",
      dataField: "packing_name",
      type: 1,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 1,
      format: "number",
    },
    {
      caption: "Đơn giá",
      dataField: "price",
      type: 1,
      format: "number",
    },
    {
      caption: "Đơn giá kê khai",
      dataField: "public_price",
      type: 1,
      format: "number",
    },
    {
      caption: "Mã kê khai ",
      dataField: "Mã kê khai",
      type: 1,
    },
    {
      caption: "Quy cách",
      dataField: "specification",
      type: 1,
    },
    {
      caption: "Hạn dùng (tháng)",
      dataField: "expiry",
      type: 1,
      format: "number",
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 1,
    },
    {
      caption: "Xuất xứ",
      dataField: "origin",
      type: 1,
    },
    {
      caption: "GPLHSP hoặc GPNK",
      dataField: "license",
      type: 1,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 1,
    },
  ],
};

export default ModalImportExcel;
