import { Col, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createDepartments } from "../../../../../redux/actions/DanhMuc";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  callApi,
  Input,
  Notification,
  Select,
  TextArea,
  useLocalStorage,
  _,
} from "../../../index";
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    setObjEdit,
    lstDepartment,
  } = props;
  const dispatch = useDispatch();

  const [isResult, setResult] = useState(null);

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
      setValue("department_parent_id", objEdit.department_parent_id);
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
    console.log(data);
    if (isStatus === 0) {
      //Thêm mới
      setResult(
        dispatch(
          createDepartments({
            ...data,
            hospital_id: "c1234567-843a-49b8-a114-1111007223c9",
          })
        )
      );
    } else {
      //Sửa
      let result = callApi(`odata/Departments?key=${data.id}`, "PUT", data)
        .then((res) => {
          Notification("success", "Sửa khoa phòng thành công.");
          setObjEdit({});
          return true;
        })
        .catch((err) => {
          Notification("error", err.response.data.errors[0]);
          return false;
        });
      setResult(result);
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Thêm khoa phòng" : "Sửa khoa phòng"}
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
        <Tabs defaultActiveKey="1">
          <TabPane tab={"Thông tin khoa phòng"} key="1">
            <form
              className="form"
              id="formKP"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Row gutter={[16, 4]}>
                <Col span={12}>
                  <Input
                    label="Mã khoa phòng"
                    name={register("code", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label="Tên khoa phòng"
                    name={register("name", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input label="Điện thoại" name={register("phone")} />
                </Col>
                <Col span={12}>
                  <Input label="Lãnh đạo" name={register("leader")} />
                </Col>
                <Col span={12}>
                  <Select
                    control={control}
                    label="Khoa phòng trực thuộc"
                    name={"department_parent_id"}
                    arrayItem={lstDepartment}
                    valueOpt="id"
                    nameOpt="name"
                  />
                </Col>

                <Col span={12}>
                  <TextArea label="Ghi chú" name={register("note")} />
                </Col>
              </Row>
            </form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
