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

function Thuoc(props) {
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
  const [editAll, setEditAll] = useState(false);
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
        openNotificationWithIcon("success", "X??a danh m???c th??nh c??ng");
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
      openNotificationWithIcon("error", "Vui l??ng ch???n th??ng/n??m c???p nh???t");
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
            openNotificationWithIcon("success", "Th??m file th??nh c??ng");
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

  const handleRowChange = (e) => {
    // console.log(e);
  };

  const handleUpdate = () => {
    setStatusModal({
      isVisible: true,
    });
    setEditAll(true);
  };

  const handleSearch = () => {
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui l??ng ch???n n??m");
      return;
    }
    let year = FormatYear(watch().year);
    setLoading(true);
    callApi(
      `odata/MedicalSupplies?$filter=type_id eq be7be5ea-a37c-430b-9ac4-ae2700200555 and year eq ${year}`,
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
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <Col span={4}>
          <ToolBar
            setStateOpen={() => handleOpenDrawer(0)}
            setEdit={() => handleOpenDrawer(1)}
            setDelete={handleDelete}
            data={isObjEdit}
          />
        </Col>
      </Row>

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
              label="N??m"
              name={"year"}
              placeholder="Ch???n n??m"
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
              T??m ki???m
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
          showPager={true}
          pageSize={true}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          typeId="be7be5ea-a37c-430b-9ac4-ae2700200555"
          editAll={editAll}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

Thuoc.propTypes = {
  columns: PropTypes.array,
  Thuoc: PropTypes.object,
};
Thuoc.defaultProps = {
  columns: [
    {
      caption: "M?? danh m???c",
      dataField: "code_byt",
      type: 0,
    },
    {
      caption: "T??n danh m???c",
      dataField: "name_byt",
      type: 0,
    },
    {
      caption: "T??n ho???t ch???t",
      dataField: "ingredient_name",
      type: 0,
    },
    {
      caption: "T??n th????ng m???i",
      dataField: "name_byt",
      type: 0,
    },
    {
      caption: "T??n tr??n bao b??",
      dataField: "name_byt",
      type: 0,
    },
    // {
    //   caption: "????n v??? t??nh",
    //   dataField: "dosage",
    //   type: 0,
    // },
    {
      caption: "???????ng d??ng",
      dataField: "usage",
      type: 0,
    },
    {
      caption: "D???ng b??o ch???",
      dataField: "model",
      type: 0,
    },
    {
      caption: "N???ng ????? h??m l????ng",
      dataField: "dosage",
      type: 0,
    },
    {
      caption: "Quy c??ch ????ng g??i",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "Quy ?????i",
      dataField: "exchange",
      type: 0,
    },
    {
      caption: "????n v??? t??nh",
      dataField: "unit",
      type: 0,
    },
    {
      caption: "Ph??n lo???i",
      dataField: "type_detail",
      type: 0,
    },

    {
      caption: "Nh??m k??? thu???t",
      dataField: "NAME",
      type: 0,
    },
    {
      caption: "Ghi ch??",
      dataField: "note",
      type: 0,
    },
    {
      caption: "N??m x??t th???u",
      dataField: "year",
      type: 0,
    },
  ],
};

export default Thuoc;
