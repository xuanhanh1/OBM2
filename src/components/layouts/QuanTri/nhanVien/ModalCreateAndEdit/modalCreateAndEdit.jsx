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

const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit } = props;
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

  useEffect(() => {
    dispatch(getAllRoles());
    if (isStatus === 1) {
      callApi(
        `odata/Roles/GetRolesOfUser?UserId=${objEdit.user_id}`,
        "GET"
      ).then((res) => {
        setLstPickRoles(res.data.value);
      });
      objEdit.date_of_birth = moment(objEdit.date_of_birth);
      setValueReactFormHook(objEdit, setValue);
    }
  }, []);
  useEffect(() => {
    if (!_.isEmpty(lstRoles) && isStatus === 0) {
      setLstPickRoles([{ NAME: _.find(lstRoles, (x) => x.ISDEFAULT)?.NAME }]);
    }
  }, [lstRoles]);
  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = (data) => {
    if (_.isEmpty(isLstPickRoles)) {
      Notification("success", "Vui lòng chọn vai trò cho người dùng này !");
    } else {
      if (isStatus === 0) {
        //Thêm mới

        const register = dispatch(
          actRegister({
            ...data,
            UserName: data.user_name,
            Password: "123456",
            hospital_id: isBenhVienId,
            lstRoles: isLstPickRoles,
          })
        );
        register.then((result) => {
          if (result) {
            setVisible(false);
          } else {
            Notification("error", "Cập nhật không thành công !");
          }
        });
      } else {
        //Sửa
        dispatch(
          updUserRoles({ Id: objEdit.user_id, lstRoles: isLstPickRoles })
        );
        dispatch(editNhanViens(data));
        setObjEdit({});
        setVisible(false);
      }
    }
  };
  const onRolesChange = (data) => {
    let arr = [];
    _.map(data, (item) => {
      arr.push({ NAME: item });
    });
    setLstPickRoles(arr);
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("ThemNV") : t("SuaNV")}
        visible={isVisible}
        width={"50vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10 }}
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
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("ThongTinNV")} key="1">
            <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[16, 0]}>
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
                    label="Tên nhân viên"
                    name={register("name", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Input label="Điện thoại" name={register("phone")} />
                </Col>

                <Col span={12}>
                  <DatePicker
                    label="Ngày sinh"
                    name="date_of_birth"
                    control={control}
                    defaultValue={moment()}
                  />
                </Col>
                <Col span={12}>
                  <Input label="Địa chỉ" name={register("address")} />
                </Col>
                <Col span={12}>
                  <Input
                    label="Email"
                    name={register("email", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    control={control}
                    label="Chức vụ"
                    name={"position_id"}
                    arrayItem={"odata/Positions"}
                    valueOpt="id"
                    nameOpt="name"
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    control={control}
                    label="Khoa phòng"
                    name={"department_id"}
                    required
                    arrayItem={"odata/Departments"}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                  />
                </Col>
                <Col span={12}>
                  <TextArea label="Ghi chú" name={register("note")} />
                </Col>
                <Col span={12}>
                  <Input
                    label="tên truy cập"
                    name={register("user_name", { required: true })}
                    required={true}
                    errors={errors}
                  />
                </Col>
              </Row>
            </form>
          </TabPane>
          <TabPane tab={t("VaiTro")} key="2">
            <Checkbox.Group
              options={lstRoles}
              defaultValue={
                isStatus === 1
                  ? isLstPickRoles
                  : _.find(lstRoles, (x) => x.ISDEFAULT)?.NAME
              }
              onChange={onRolesChange}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {};
ModalCreateAndEdit.defaultValue = {};

export default ModalCreateAndEdit;
