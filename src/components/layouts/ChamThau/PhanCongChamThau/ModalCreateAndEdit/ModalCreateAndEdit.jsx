import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs, Checkbox } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import { editNhanViens } from "../../../../../redux/actions/DanhMuc";
import { actRegister } from "../../../../../redux/actions/Users";
import {
  getAllRoles,
  updUserRoles,
} from "../../../../../redux/actions/QuanTri";
import {
  useLocalStorage,
  _,
  moment,
  Input,
  Select,
  TextArea,
  DatePicker,
  Notification,
  callApi,
} from "../../../index";
import { gioiTinh } from "../../../../controller/DataSample";
import openNotificationWithIcon from "../../../../../common/notification/notification";
const { TabPane } = Tabs;
function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    setObjEdit,
    documentTeam,
    lstPick,
    documentItem,
    setBtnAllot,
  } = props;
  console.log("documentTeam", documentTeam);
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const lstRoles = useSelector((state) => state.QuanTriReducers.lstRoles);
  const [isLstPickRoles, setLstPickRoles] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = (data) => {
    console.log("data", data);
    console.log("lstPick", lstPick);
    console.log("documentItem", documentItem);
    console.log("documentTeam", documentTeam);
    let dataSend = [];
    if (lstPick && lstPick.length > 0) {
      dataSend = lstPick.map((item) => item.id);
    }
    callApi(
      `odata/Bids/AssignTask?bidding_document_id=${documentItem.id}&member_id=${
        watch().team_id
      }`,
      "POST",
      dataSend
    )
      .then((res) => {
        console.log("res", res);
        openNotificationWithIcon(
          "success",
          "Cập nhật thành viên chấm thầu thành công"
        );
        setVisible(false);
        setBtnAllot(true);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
      });
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("") : t("Phân công nhân viên chấm thầu")}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 100 }}
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
          <Col span={12}>
            <Select
              control={control}
              label="Tổ chấm thầu"
              name={"team_id"}
              required
              arrayItem={documentTeam}
              valueOpt="id"
              nameOpt="staff_name"
              errors={errors}
            />
          </Col>
        </form>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
