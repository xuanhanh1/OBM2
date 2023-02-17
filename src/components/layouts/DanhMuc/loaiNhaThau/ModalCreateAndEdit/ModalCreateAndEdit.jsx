import { Checkbox, Col, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import {
  CreateBidder,
  createDepartments,
  EditBidder,
  getALLDepartments,
} from "../../../../../redux/actions/DanhMuc";
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
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  const [isResult, setResult] = useState(null);
  const [lstTypes, setListTypes] = useState([]);
  const [isLstPickTypes, setLstPickTypes] = useState([]);

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
      // console.log("objEdit",objEdit);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  //Submit form
  const onSubmit = async (data) => {
    console.log(data);
    if (isStatus === 0) {
      //Thêm mới
      let result = await dispatch(CreateBidder(data));
      if (result) {
        openNotificationWithIcon("success", "Thêm nhà thầu thành công ");
        setVisible(false);
      }
    } else {
      //Sửa

      let result = await dispatch(EditBidder(data));
      if (result) {
        openNotificationWithIcon("success", "Sửa nhà thầu thành công ");
        setVisible(false);
      }
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? "Thêm nhà thầu" : "Sửa nhà thầu"}
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
                label="Mã nhà thầu"
                name={register("code", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Tên nhà thầu"
                name={register("name", { required: true })}
                required={true}
                errors={errors}
              />
            </Col>
            <Col span={12}>
              <Input
                label="Tên nhà thầu (viết tắt)"
                name={register("shortcut_name", { required: true })}
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
              <Input label="Mã số thuế" name={register("tax_code")} />
            </Col>
            <Col span={12}>
              <Input
                label="Nhà phân phối"
                name={register("is_distributor")}
                type="checkbox"
              />
            </Col>
            <Col span={12}>
              <Select
                control={control}
                label="Loại nhà thầu"
                name={"bidder_type_id"}
                arrayItem={`odata/BidderTypes`}
                valueOpt="id"
                nameOpt="name"
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

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
