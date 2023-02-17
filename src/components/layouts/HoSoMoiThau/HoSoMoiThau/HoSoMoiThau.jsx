import React, { useState, useEffect } from "react";
import { Tabs, Button, Col, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, Select, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import ModalCreateAndEdit from "./modalCreateAndEdit/ModalCreateAndEdit";
import openNotificationWithIcon from "../../../../common/notification/notification";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import moment from "moment";
import { FormatYear } from "../../../controller/Format";
import PhatHanhHoSo from "./PhatHanhHoSo";
import MoThau from "./MoThau";
import DangChamThau from "./DangChamThau";
import CongKhaiKetQua from "./CongKhaiKetQua";
import HoanThanh from "./HoanThanh";
const { TabPane } = Tabs;
function HoSoMoiThau(props) {
  const { columns } = props;
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
  const [lstMedicalSupplies, setLstMedicalSupplies] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    let today = moment(new Date(), "YYYY");
    setValue("year", today);
    callApi(`odata/MedicalSuppliestypes`, "GET").then((res) => {
      setValue("type_id", res.data.value[0].id);
      callApi(
        `odata/BiddingDocuments?$Filter=year eq ${FormatYear(
          today
        )} and type_id eq be7be5ea-a37c-430b-9ac4-ae2700200555 and status_id eq ed30e18d-72ee-4cd8-a9ec-6f7f25efc33f`
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

  const handleDelete = (params) => {
    callApi(`odata/BiddingDocuments?key=${params.id}`, "DELETE")
      .then((res) => {
        openNotificationWithIcon("success", "Xóa gói thầu thành công");
        handleSearch();
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm dự thầu.");
      return;
    }
    let year = FormatYear(watch().year);
    let status = `and status_id eq ed30e18d-72ee-4cd8-a9ec-6f7f25efc33f`;

    let type = !_.isEmpty(watch().type_id)
      ? `and type_id eq ${watch().type_id}`
      : "";
    setLoading(true);
    callApi(`odata/BiddingDocuments?$Filter=year eq ${year} ${type} ${status} `)
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
    if (isObjEdit.status_id === "dbf2da25-f93a-4989-a00c-51c179f2f966") {
      openNotificationWithIcon("warning", "Hồ sơ đã được phát hành");
      return;
    }
    setLoadingStatus(true);
    callApi(`odata/BiddingDocuments/UpdateStatus?key=${isObjEdit.id}`, "PUT")
      .then((res) => {
        openNotificationWithIcon("success", "Phát hành hồ sơ thành công");
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
            <YearPickerField
              control={control}
              label="Năm"
              name={"year"}
              placeholder="Chọn năm"
              errors={errors}
            />
          </Col>

          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              loading={isLoading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
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
              Phát hành hồ sơ
            </Button>
          </Col>
        </div>
      </Row>
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",

            width: "100%",
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tạo mới hồ sơ " key="1">
              <ToolBar
                setStateOpen={() => handleOpenDrawer(0)}
                setEdit={() => handleOpenDrawer(1)}
                setDelete={handleDelete}
                data={isObjEdit}
              />

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
            </TabPane>
            <TabPane tab={"Phát hành hồ sơ"} key="2">
              <PhatHanhHoSo
                year={watch().year}
                status={watch().status_id}
                type={watch().type_id}
              />
            </TabPane>
            <TabPane tab={"Mở thầu"} key="3">
              <MoThau
                year={watch().year}
                status={watch().status_id}
                type={watch().type_id}
              />
            </TabPane>
            <TabPane tab={"Chấm thầu"} key="4">
              <DangChamThau
                year={watch().year}
                status={watch().status_id}
                type={watch().type_id}
              />
            </TabPane>
            <TabPane tab={"Công khai kết quả"} key="5">
              <CongKhaiKetQua
                year={watch().year}
                status={watch().status_id}
                type={watch().type_id}
              />
            </TabPane>
            <TabPane tab={"Hoàn thành"} key="6">
              <HoanThanh
                year={watch().year}
                status={watch().status_id}
                type={watch().type_id}
              />
            </TabPane>
          </Tabs>
        </div>
      </Row>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )}
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

HoSoMoiThau.propTypes = {
  columns: PropTypes.array,
  HoSoMoiThau: PropTypes.object,
};
HoSoMoiThau.defaultProps = {
  columns: [
    {
      caption: "Mã gói thầu",
      dataField: "code",
      type: 0,
      width: "",
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
      caption: "Tỉ lệ ưu đãi ",
      dataField: "favour_rate",
      type: 0,
      format: "number",
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

export default HoSoMoiThau;
