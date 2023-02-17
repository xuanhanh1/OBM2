import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Descriptions, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { callApi, _ } from "../../../index";
import { createTypesDepartment } from "../../../../../redux/actions/DanhMuc";

function DrawerKhoaPhong(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const dispatch = useDispatch();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [lstTypes, setListTypes] = useState([]);
  const [isLstPickTypes, setLstPickTypes] = useState([]);
  useEffect(() => {
    callApi(
      `odata/TypeMedicalSupplies/GetByDepartmentId?department_id=${objView.Id}`,
      "GET"
    ).then((res) => {
      setLstPickTypes(
        res.data.map((item) => {
          return {
            type_id: item.Id,
          };
        })
      );
    });
    callApi("odata/TypeMedicalSupplies", "GET").then((res) => {
      setListTypes(
        res.data.value.map((item) => {
          return {
            label: item.name,
            value: item.Id,
          };
        })
      );
    });
  }, []);
  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  const onRolesChange = (data) => {
    setLstPickTypes(
      data.map((item) => {
        return {
          type_id: item,
        };
      })
    );
  };
  const handleUpdTypes = () => {
    dispatch(
      createTypesDepartment({ Id: objView.Id, LstTypes: isLstPickTypes })
    );
  };
  return (
    <>
      <Drawer
        title={`Thông tin khoa phòng`}
        placement="right"
        width={"800px"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions size="small" bordered>
              <Descriptions.Item label="Mã khoa/phòng" span={1.5}>
                <b>{objView.MA_KP}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Khoa/phòng" span={1.5}>
                <b>{objView.TEN_KP}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Lãnh đạo" span={1.5}>
                <b>{objView.LANHDAO}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại" span={1.5}>
                <b>{objView.DIENTHOAI}</b>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {!_.isEmpty(lstTypes) && (
            <Col span={24}>
              <Checkbox.Group
                options={lstTypes}
                defaultValue={isLstPickTypes.map((item) => item.type_id)}
                onChange={onRolesChange}
              />
            </Col>
          )}
          <Col span={8} offset={16}>
            <Button type="primary" onClick={handleUpdTypes}>
              Cập nhật loại khoa/phòng
            </Button>
          </Col>
        </Row>
      </Drawer>
    </>
  );
}

DrawerKhoaPhong.defaultProps = {};

export default DrawerKhoaPhong;
