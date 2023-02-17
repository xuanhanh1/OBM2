import React, { useState, useEffect } from "react";
import { Col, PageHeader, Row, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi, UploadFile } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import openNotificationWithIcon from "../../../../common/notification/notification";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import { FormatYear } from "../../../controller/Format";
import moment from "moment";

function VatTu(props) {
  const { columns } = props;
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
  const [isObjEdit, setObjEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [lstMedicalSupplies, setLstMedicalSupplies] = useState([]);
  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editAll, setEditAll] = useState(false);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    let today = moment(new Date(), "YYYY");
    setValue("year", today);
    handleSearch();
  }, []);

  useEffect(() => {
    console.log("isStatusModal.isVisible", isStatusModal.isVisible);
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
  const selectedRow = (params) => {
    console.log("params", params);
    setObjEdit(params);
  };

  const handleDelete = () => {
    callApi(
      `odata/MedicalSupplies?key=${isObjEdit[0].id}
      `,
      "DELETE"
    )
      .then((res) => {
        openNotificationWithIcon("success", "Xóa danh mục thành công");
        handleSearch();
      })
      .catch((err) => console.log(err));
  };

  const handleRowChange = (e) => {
    // console.log(e);
  };

  const handleSearch = () => {
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm");
      return;
    }
    let year = FormatYear(watch().year);
    setLoading(true);
    callApi(
      `odata/MedicalSupplies?$filter=type_id eq ad8a1f68-2542-4713-9dd8-ae2700201123 and year eq ${year}`,
      "GET"
    )
      .then((res) => {
        setLstMedicalSupplies(res.data.value);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />

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

      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstMedicalSupplies}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
          selectionMode="multiple"
          handleRowChange={handleRowChange}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          typeId="ad8a1f68-2542-4713-9dd8-ae2700201123"
          editAll={editAll}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

VatTu.propTypes = {
  columns: PropTypes.array,
  VatTu: PropTypes.object,
};
VatTu.defaultProps = {
  columns: [
    // {
    //   caption: "TT BV",
    //   dataField: "code_bv",
    //   type: 0,
    // },
    {
      caption: "Mã danh mục",
      dataField: "code_byt",
      type: 0,
    },
    {
      caption: "Tên danh mục ",
      dataField: "name_byt",
      type: 0,
    },
    {
      caption: "Tên thương mại",
      dataField: "NAME",
      type: 0,
    },

    {
      caption: "Đơn vị tính",
      dataField: "unit",
      type: 0,
    },
    {
      caption: "Mã sản phẩm",
      dataField: "model",
      type: 0,
    },
    {
      caption: "Hãng sản xuất",
      dataField: "NAME",
      type: 0,
    },
    {
      caption: "Đơn giá",
      dataField: "NAME",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default VatTu;
