import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Modal, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  createPositions,
  editPositions,
} from "../../../../../redux/actions/DanhMuc";
import { _, Input, TextArea, Notification } from "../../../index";
function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;

  const [isResult, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (!_.isNull(isResult)) {
      isResult.then((result) => {
        if (result) {
          setVisible(false);
        } else {
          Notification("error", "Cập nhật không thành công");
        }
      });
    }
  }, [isResult]);
  //Submit form
  const onSubmit = (data) => {
    if (isStatus === 0) {
      //Thêm mới
      setResult(
        dispatch(
          createPositions({
            ...data,
            hostpital_id: "c1234567-843a-49b8-a114-1111007223c9",
          })
        )
      );
    } else {
      //Sửa
      setResult(
        dispatch(
          editPositions({
            ...data,
            hostpital_id: "c1234567-843a-49b8-a114-1111007223c9",
          })
        )
      );
      setObjEdit({});
    }
    setVisible(false);
  };
  return (
    <div>
      <Modal
        title={isStatus === 0 ? "ThemCV" : "SuaCV"}
        visible={isVisible}
        width={"40vw"}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {"Huy"}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {"LuuThongTin"}
          </button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Mã chức vụ"
                name={register("code", { required: true })}
                required={true}
                errors={errors}
              />
              <Input
                label="Tên chức vụ"
                name={register("name", { required: true })}
                required={true}
                errors={errors}
              />
              <TextArea label="GHICHU" name={register("note")} />
            </form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
