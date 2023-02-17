import { Button, Col, Modal, Row, Spin, Tabs } from "antd";
import { CSVDownload } from "react-csv";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { _, callApi, UploadFile } from "../../index";

import PropTypes from "prop-types";
import openNotificationWithIcon from "../../../../common/notification/notification";

import DataGridChamThauExcel from "../../../../common/control/dataGridChamThauExcel";
import TabPane from "antd/lib/tabs/TabPane";

const { confirm } = Modal;

function ChamThauUpLoadExcel(props) {
  const {
    objEdit,
    columns,
    pickDocument,
    detailBV,
    lstBider,
    setVisible,
    typeId,
    modeId,
  } = props;

  const [isResult, setResult] = useState(null);
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
  const [respone, setRespone] = useState(false);
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoadingExcel, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataRespone, setDataRespone] = useState([]);
  const [technicalCriteriaGroups, setTechnicalCriteriaGroups] = useState([]);
  const [lstTechnicalEvaluationTypes, setLstTechnicalEvaluationTypes] =
    useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  console.log("pickDocument", pickDocument, typeId);
  useEffect(() => {
    _.map(lstBider, function (i) {
      return {
        ...i,
        ...detailBV,
      };
    });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(pickDocument)) {
      setLoading(true);
      if (typeId === "be7be5ea-a37c-430b-9ac4-ae2700200555") {
        //thuoc
        callApi(
          `odata/BidDetailThuocs?bidding_document_id=${pickDocument}`,
          "GET"
        )
          .then((res) => {
            setLstDocument(res.data.value);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else if (typeId === "ad8a1f68-2542-4713-9dd8-ae2700201123") {
        //vat tu
        callApi(
          `odata/BidDetailByHospitals?bidding_document_id=${pickDocument}`,
          "GET"
        )
          .then((res) => {
            console.log(res.data);
            setLstDocument(res.data.value);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  }, [pickDocument]);

  const selectedRow = (params) => {};

  const selectedRowTCKT = (params) => {};

  const handleRowChange = (e) => {
    let pickKey = e[0].key;
  };

  useEffect(() => {
    callApi(`odata/TechnicalCriteriaGroups`, "GET").then((res) => {
      setTechnicalCriteriaGroups(res.data.value);
    });

    callApi(
      `odata/TechnicalEvaluationTypes?$Expand=details&$filter=medical_supplies_type_id eq ${typeId}`,
      "GET"
    ).then((res) => {
      setLstTechnicalEvaluationTypes(res.data.value[0].details);
    });
  }, []);

  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0]?.originFileObj);
    setFileExcel(formData);
  };

  const handleUploadFile = () => {
    setIsLoading(true);
    callApi(
      `odata/BidEvaluations/ImportExcel?bidding_document_id= ${pickDocument} `,
      "POST",
      isFileExcel,
      "multipart/form-data"
    )
      .then((res) => {
        openNotificationWithIcon("success", "Thêm file thành công");
        setLstDocument(res.data);
        setIsLoading(false);
        // setVisible(false);
      })
      .catch((err) => {
        if (!_.isEmpty(err.response.data.errors)) {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        }
        console.log(err.response.data);
        setIsLoading(false);

        setDataRespone(err.response.data);
        setRespone(true);
      });
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
    <>
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="Phụ lục 1 (Theo danh mục)" key="1">
          <Spin spinning={loading}>
            <div
              className="gridView gridViewBHXH"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <DataGridChamThauExcel
                data={lstDocument}
                data2={lstTechnicalEvaluationTypes}
                data3={technicalCriteriaGroups}
                dataKey={"medical_supplies_name_byt"}
                showFilterRow={true}
                exportExcel={false}
                typeId={typeId}
                modeId={modeId}
                showPager={true}
                groupByBidder={true}
              />
            </div>
          </Spin>
        </TabPane>
        <TabPane tab="Phụ lục 2 (Theo nhà thầu)" key="2">
          <Spin spinning={loading}>
            <div
              className="gridView gridViewBHXH"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <DataGridChamThauExcel
                data={lstDocument}
                data2={lstTechnicalEvaluationTypes}
                data3={technicalCriteriaGroups}
                dataKey={"medical_supplies_name_byt"}
                showFilterRow={true}
                exportExcel={false}
                typeId={typeId}
                modeId={modeId}
                showPager={true}
              />
            </div>
          </Spin>
        </TabPane>
      </Tabs>

      {respone ? (
        <CSVDownload data={dataRespone} target="_blank" filename={"File lỗi"} />
      ) : null}
    </>
  );
}

ChamThauUpLoadExcel.propTypes = {
  columns: PropTypes.array,
  columnsChoice: PropTypes.array,
  ChamThauUpLoadExcel: PropTypes.object,
};
ChamThauUpLoadExcel.defaultProps = {};

export default ChamThauUpLoadExcel;
