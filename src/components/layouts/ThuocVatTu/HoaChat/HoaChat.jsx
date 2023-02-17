import React, { useState, useEffect } from "react";
import { PageHeader, Row, Button, Col } from "antd";
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

function HoaChat(props) {
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
    // const obj = _.find(lstRoles, (x) => x.Id === params);
    // setObjEdit(obj);
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

  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0]?.originFileObj);
    setFileExcel(formData);
  };

  const handleUploadFile = () => {
    if (_.isNull(watch().month)) {
      openNotificationWithIcon("error", "Vui lòng chọn tháng/năm cập nhật");
    } else {
      const month =
        watch().month.month() + 1 < 10
          ? "0" + (watch().month.month() + 1)
          : watch().month.month() + 1;
      const year = watch().month.year();
      setIsLoading(true);
      callApi(
        `odata/Timesheetss/ImportExcel?month=${month}&year=${year}`,
        "POST",
        isFileExcel,
        "multipart/form-data"
      )
        .then((res) => {
          setIsLoading(false);
          callApi(
            `odata/Timesheetss?$filter=month eq '${month}' and year eq '${year}'`
          ).then((res) => {
            openNotificationWithIcon("success", "Thêm file thành công");
            setFileExcel(null);
          });
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
          console.log(err.response);
          setIsLoading(false);
        });
    }
  };

  const handleSearch = () => {
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm");
      return;
    }
    let year = FormatYear(watch().year);
    setLoading(true);
    callApi(
      `odata/MedicalSupplies?$filter=type_id eq 1f61d5f3-2eb6-4533-9a54-ae2700208888 and year eq ${year}`,
      "GET"
    )
      .then((res) => {
        setLstMedicalSupplies(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRowChange = (e) => {
    // console.log(e);
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
          typeId="1f61d5f3-2eb6-4533-9a54-ae2700208888"
        />
      ) : (
        <></>
      )}
    </div>
  );
}

HoaChat.propTypes = {
  columns: PropTypes.array,
  HoaChat: PropTypes.object,
};
HoaChat.defaultProps = {
  columns: [
    // {
    //   caption: "TT BV",
    //   dataField: "code_bv",
    //   width: "5vw",
    // },
    {
      caption: "Mã danh mục",
      dataField: "code_byt",
      type: 0,
    },
    {
      caption: "Tên danh mục",
      dataField: "name_byt",
      width: "20vw",
      type: 0,
    },
    {
      caption: "Tên thương mại",
      dataField: "tradename",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Tên hoạt chất",
      dataField: "ingredient_name",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Đơn vị tính",
      dataField: "unit",
      type: 0,
    },
    {
      caption: "Quy cách đóng gói",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "Hãng sản xuất",
      dataField: "model",
      type: 0,
    },
    // {
    //   caption: "Nước sản xuất",
    //   dataField: "note",
    //   type: 0,
    // },
  ],
};

export default HoaChat;
