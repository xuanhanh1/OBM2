import { Col, Divider, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  Input,
  Notification,
  _,
  callApi,
  TextArea,
  Select,
  DataGrid,
} from "../../../index";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import DatePicker from "../../../../../common/control/componentsForm/DatePicker";
import PropTypes from "prop-types";
import {
  getAllBidder,
  getAllBidDocument,
} from "../../../../../redux/actions/GoiThau";
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, columns } =
    props;

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
  const [disableOne, setDisableOne] = useState(false);
  const [list, setList] = useState([]);
  const [listChoice, setListChoice] = useState([]);
  const [lstStaff, setLstStaff] = useState([]);
  const lstBidDocument = useSelector(
    (state) => state.GoiThauReducers.lstBidDocument
  );
  const lstBidder = useSelector((state) => state.GoiThauReducers.lstBidder);

  useEffect(() => {
    if (isStatus === 1) {
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
    }
  }, []);

  useEffect(() => {
    dispatch(getAllBidDocument());
    dispatch(getAllBidder());
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRow = ([params]) => {
    // const obj = _.find(lstRoles, (x) => x.Id === params);
    // setObjEdit(obj);
  };

  //Submit form
  const onSubmit = async (data) => {
    console.log(data);

    if (isStatus === 0) {
      //Thêm mới
      callApi(`odata/Bids`, "POST", data)
        .then((res) => {
          openNotificationWithIcon("success", "Thêm nhà thầu tham gia thầu");
          setVisible(false);
        })
        .catch((err) => console.log(err));
    } else {
      //Sửa
    }
  };

  return (
    <div>
      <Modal
        title={
          isStatus === 0
            ? t("Thêm nhà thầu tham gia thầu")
            : t("Sửa nhà thầu tham gia thầu")
        }
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 120 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[8, 16]}>
            <Col span={12}>
              <Select
                control={control}
                label="Tên gói thầu"
                name={"bidding_document_id"}
                arrayItem={lstBidDocument}
                valueOpt="id"
                nameOpt="name"
                errors={errors}
                classDefault="input-custom"
                classLabel="label-custom"
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Tên nhà thầu"
                name={"bidder_id"}
                arrayItem={lstBidder}
                valueOpt="id"
                nameOpt="name"
                errors={errors}
                classDefault="input-custom"
                classLabel="label-custom"
              />
            </Col>
            <Col span={8}>
              <Input
                control={control}
                label="Người mua"
                name={register("buyer", { required: true })}
                // disabled
                required
                errors={errors}
              />
            </Col>

            <Col span={8}>
              <DatePicker
                placeholder="Chọn ngày"
                label="Ngày mua"
                name="buy_date"
                control={control}
                defaultValue={null}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={8}>
              <TextArea
                label="Ghi chú"
                control={control}
                name={register("note")}
              />
            </Col>

            {/* <Col span={24}>
              <div
                className="gridView"
                style={{ height: "calc(100vh - 300px)" }}
              >
                <DataGrid
                  column={columns}
                  data={listChoice}
                  dataKey={"id"}
                  showFilterRow={true}
                  selectionChanged={selectedRow}
                  exportExcel={false}
                  allowView={true}
                />
              </div>
            </Col> */}
          </Row>
        </form>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {
  columns: PropTypes.array,
  ModalCreateAndEdit: PropTypes.object,
};
ModalCreateAndEdit.defaultProps = {
  columns: [
    {
      caption: "Mã nhân viên",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tên nhân viên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Khoa phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
  ],
};

export default ModalCreateAndEdit;
