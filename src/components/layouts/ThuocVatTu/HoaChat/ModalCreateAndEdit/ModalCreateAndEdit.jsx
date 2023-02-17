import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Modal, Row, Col, Spin } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  EditMedicalSuppliesT,
  editPositions,
} from "../../../../../redux/actions/DanhMuc";
import {
  useLocalStorage,
  _,
  Input,
  TextArea,
  Notification,
  callApi,
} from "../../../index";
function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    setObjEdit,

    typeId,
  } = props;
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const [loading, setLoading] = useState(false);
  const [isResult, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit[0], setValue);
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
    let lstId = [];
    if (objEdit && objEdit.length > 1) {
      lstId = objEdit.map((item) => item.id);
    }

    let dataPost = {
      ...data,
      year: Number(data.year),
      type_id: typeId,
    };

    console.log("dataPost", dataPost);

    if (objEdit.length > 1) {
      setLoading(true);
      callApi(
        `odata/MedicalSupplies/UpdateCodeBV?year=${watch().year}`,
        "PUT",
        lstId
      )
        .then((res) => {
          Notification("success", "Thêm danh sách thành công !");
          setLoading(false);
          setVisible(false);
        })
        .catch((err) => {
          console.log(err.response.data);
          Notification("error", err.response.data.errors[0]);
          setLoading(false);
        });
    } else {
      if (isStatus === 0) {
        //Thêm mới
        callApi(`odata/MedicalSupplies`, "POST", dataPost)
          .then((res) => {
            Notification("success", "Thêm mới danh mục thành công !");
            setVisible(false);
          })
          .catch((err) => {
            console.log(err.response.data);
            Notification("error", err.response.data.errors[0]);
          });
      } else {
        //Sửa
        callApi(
          `odata/MedicalSupplies?key=${objEdit[0].id}
        `,
          "PUT",
          dataPost
        )
          .then((res) => {
            Notification("success", "Sửa danh mục thành công !");
            setVisible(false);
          })
          .catch((err) => {
            console.log(err.response.data);
            Notification("error", err.response.data.errors[0]);
          });
      }
    }

    // setVisible(false);
  };
  return (
    <div>
      <Modal
        title={
          isStatus === 0 ? "Thêm danh sách Hóa chất" : "Sửa danh sách Hóa chất"
        }
        visible={isVisible}
        width={objEdit.length > 1 ? "40vw" : "80vw"}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {"Hủy"}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {"Lưu thông tin "}
          </button>,
        ]}
      >
        {loading ? (
          <div className="example">
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {objEdit.length > 1 ? (
              <Col span={24}>
                <form
                  className="form"
                  id="form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    label="Năm"
                    name={register("year", { required: true })}
                    required={true}
                    errors={errors}
                  />

                  <TextArea label="Ghi chú" name={register("note")} />
                </form>
              </Col>
            ) : (
              <form
                className="form"
                id="form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row gutter={[16, 0]}>
                  <Col span={6}>
                    <Input
                      label="Năm"
                      name={register("year", { required: true })}
                      required={true}
                      errors={errors}
                      type={"Number"}
                      // min={2000}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Mã bộ y tế"
                      name={register("code_byt", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Mã bệnh viện"
                      name={register("code_bv", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Tên bộ y tế"
                      name={register("name_byt", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Tên hoạt chất"
                      name={register("ingredient_name", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Hãng sản xuất"
                      name={register("model", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Quy đổi"
                      name={register("exchange", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Quy cách"
                      name={register("specification", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Nồng độ hàm lương"
                      name={register("dosage", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Đơn vị tính"
                      name={register("unit", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Đường dùng"
                      name={register("usage", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Ghi chú"
                      name={register("note", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      label="Phân loại"
                      name={register("type_detail", { required: true })}
                      required={true}
                      errors={errors}
                    />
                  </Col>
                </Row>
              </form>
            )}
          </Row>
        )}
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
