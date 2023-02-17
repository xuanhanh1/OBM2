import { Col, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import {
  CreateStaffBidder,
  EditStaffBidder,
} from "../../../../../redux/actions/DanhMuc";
import { setValueReactFormHook } from "../../../../controller/Format";
import { Input, TextArea, useLocalStorage, _ } from "../../../index";

function CreateAndEditStaffBidder(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    setObjEdit,

    objView,
  } = props;
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  //Submit form
  const onSubmit = async (data) => {
    let dataSend = {
      ...data,
      bidder_id: objView.id,
    };
    if (isStatus === 0) {
      //Thêm mới
      let result = await dispatch(CreateStaffBidder(dataSend));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Thêm nhân viên của nhà thầu thành công"
        );
        setVisible(true);
      }
    } else {
      //Sửa
      let result = await dispatch(EditStaffBidder(dataSend));
      if (result) {
        openNotificationWithIcon(
          "success",
          "Sửa nhân viên của nhà thầu thành công"
        );
        setVisible(true);
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Thêm nhân viên" : "Sửa nhân viên"}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {"Huy"}
          </button>,
          <button
            form="formKP"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {"Lưu thông tin"}
          </button>,
        ]}
      >
        <form className="form" id="formKP" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 4]}>
            <Col span={12}>
              <Input
                label="Mã nhân viên"
                name={register("code", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>

            <Col span={12}>
              <Input
                label="Tên nhân viên)"
                name={register("name", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input label="Địa chỉ" name={register("address")} />
            </Col>
            <Col span={12}>
              <Input label="Số điện thoại" name={register("phone")} />
            </Col>
            <Col span={12}>
              <Input label="Email" name={register("email")} />
            </Col>
            <Col span={12}>
              <Input
                label="Tên đăng nhập"
                name={register("username", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>

            <Col span={24}>
              <TextArea label="GHICHU" name={register("note")} />
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
}

CreateAndEditStaffBidder.propTypes = {};
CreateAndEditStaffBidder.defaultValue = {};

export default CreateAndEditStaffBidder;
