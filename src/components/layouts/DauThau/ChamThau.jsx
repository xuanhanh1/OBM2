import React, { useState, useEffect } from "react";
import { PageHeader, Button, Col, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, Select, callApi } from "../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";

const NhaThau = (props) => {
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
  const [lstDocument, setLstDocument] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstDocument, (x) => x.id === params);
    setObjEdit(obj);
  };

  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        // setDelete={handleDelete}
        data={isObjEdit}
      />
      {/* <Row
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
            label="Loại thuốc/vật tư"
            name={"type_id"}
            arrayItem={`odata/MedicalSuppliestypes`}
            valueOpt="id"
            nameOpt="name"
            errors={errors}
            classDefault="input-custom"
            classLabel="label-custom"
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
      </div>
    </Row> */}
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstDocument}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
          allowView={true}
        />
      </div>
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
    </div>
  );
};

NhaThau.propTypes = {
  columns: PropTypes.array,
  NhaThau: PropTypes.object,
};
NhaThau.defaultProps = {
  columns: [
    {
      caption: "Đơn vị mời thầu",
      dataField: "hospital_name",
      type: 0,
    },
    {
      caption: "Đơn vị đấu thầu",
      dataField: "bidder_name",
      type: 0,
    },
    {
      caption: " Hồ sơ mời thầu",
      dataField: "bidding_document_name",
      type: 0,
    },
    {
      caption: "Thứ tự tham gia",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Người mua hồ sơ",
      dataField: "buyer",
      type: 0,
    },
    {
      caption: "Ngày mua",
      dataField: "buy_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Người nộp",
      dataField: "submitter",
      type: 0,
    },
    {
      caption: "Ngày nộp",
      dataField: "submit_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default NhaThau;
