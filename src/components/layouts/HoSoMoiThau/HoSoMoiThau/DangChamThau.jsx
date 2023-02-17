import React, { useState, useEffect } from "react";
import { PageHeader, Button, Col, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, Select, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
  RedoOutlined,
} from "@ant-design/icons";

import moment from "moment";
import openNotificationWithIcon from "../../../../common/notification/notification";
import { FormatYear } from "../../../controller/Format";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
function DangChamThau(props) {
  const { columns, year, status, type } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [isObjEdit, setObjEdit] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLoadingStatus, setLoadingStatus] = useState(false);
  const [lstDocument, setLstDocument] = useState([]);

  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    if (_.isEmpty(year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm dự thầu.");
      return;
    }
    let year1 = FormatYear(year);
    let status1 = `and status_id eq c0935543-e073-41e9-9162-410614383691`;
    let type1 = !_.isEmpty(type) ? `and type_id eq ${type}` : "";
    setLoading(true);
    callApi(
      `odata/BiddingDocuments?$Filter=year eq ${year1} ${type1} ${status1} `
    )
      .then((res) => {
        _.orderBy(res.data.value, ["update_date"], ["asc"]);
        setLstDocument(res.data.value);
        setLoading(false);
        setObjEdit(undefined);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      handleSearch();
    }
  }, [isStatusModal.isVisible]);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };

  const selectedRow = ([params]) => {
    const obj = _.find(lstDocument, (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleDelete = (params) => {};

  const handleSearch = () => {
    let year1 = FormatYear(year);
    let status1 = `and status_id eq c0935543-e073-41e9-9162-410614383691`;
    let type1 = !_.isEmpty(type) ? `and type_id eq ${type}` : "";
    setLoading(true);
    callApi(
      `odata/BiddingDocuments?$Filter=year eq ${year1} ${type1} ${status1} `
    )
      .then((res) => {
        _.orderBy(res.data.value, ["update_date"], ["asc"]);
        setLstDocument(res.data.value);
        setLoading(false);
        setObjEdit(undefined);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoadingStatus(true);
    callApi(`odata/BiddingDocuments/UpdateStatus?key=${isObjEdit.id}`, "PUT")
      .then((res) => {
        openNotificationWithIcon("success", "Công khai kết quả thành công");
        handleSearch();
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.log(err.response);
        openNotificationWithIcon("warning", err.response?.data.errors[0]);
        setLoadingStatus(false);
      });
  };

  const handleRefresh = () => {
    handleSearch();
  };
  const handleRemove = () => {
    setLoadingStatus(true);
    callApi(`odata/BiddingDocuments/ReturnStatus?key=${isObjEdit.id}`, "PUT")
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Gói thầu đã quay lại trạng thái trước đó"
        );
        handleSearch();
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.log(err.response);
        openNotificationWithIcon("warning", err.response?.data.errors[0]);
        setLoadingStatus(false);
      });
  };
  return (
    <div>
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={3}>
            <Button
              icon={<RedoOutlined />}
              loading={isLoading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Col>
          <Col span={3}>
            <Button
              loading={isLoadingStatus}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdate}
              disabled={isObjEdit ? false : true}
            >
              Công khai kết quả
            </Button>
          </Col>
          <Col span={3}>
            <Button
              loading={isLoadingStatus}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleRemove}
              disabled={isObjEdit ? false : true}
            >
              Quay lại
            </Button>
          </Col>
        </div>
      </Row>
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstDocument}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
          allowView={true}
          viewObj={handleOpenDrawer1}
        />
      </div>
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );
}

DangChamThau.propTypes = {
  columns: PropTypes.array,
  DangChamThau: PropTypes.object,
};
DangChamThau.defaultProps = {
  columns: [
    {
      caption: "Mã gói thầu",
      dataField: "code",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Tên gói thầu",
      dataField: "name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Loại gói thầu",
      dataField: "type_name",
      type: 0,
      width: "4vw",
    },
    {
      caption: "Phương thức đấu thầu",
      dataField: "mode_name",
      type: 0,
      width: "8vw",
    },
    {
      caption: "Hình thức đấu thầu",
      dataField: "form_name",
      type: 0,
      width: "10vw",
    },
    {
      caption: "Dự án",
      dataField: "project",
      type: 0,
    },
    {
      caption: "Ngày phát hành",
      dataField: "public_date",
      type: 0,
      format: "date",
      width: "5vw",
    },
    {
      caption: "Số quyết định",
      dataField: "decision_number",
      type: 0,
      width: "7vw",
    },
    {
      caption: "Ngày quyết định",
      dataField: "decision_date",
      type: 0,
      format: "date",
      width: "5vw",
    },
    {
      caption: "Ngày mở thầu",
      dataField: "opening_date",
      type: 0,
      format: "date",
      width: "5vw",
    },
    {
      caption: "Tổ chấm thầu",
      dataField: "team_name",
      type: 0,
      width: "8vw",
    },
    {
      caption: "Tỉ lệ kỹ thuật ",
      dataField: "technical_rate",
      type: 0,
      format: "number",
    },
    {
      caption: "Tỉ lệ tài chính",
      dataField: "financial_rate",
      type: 0,
      format: "number",
    },
    {
      caption: "Năm dự thầu",
      dataField: "year",
      type: 0,
      format: "number",
    },
    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
      width: "7vw",
    },
  ],
};

export default DangChamThau;
