import { Button, Space, Popconfirm, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  PrinterOutlined,
  DeleteOutlined,
  CheckOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import openNotificationWithIcon from "../notification/notification";
import "./index.css";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
ToolBar.propTypes = {
  setStateOpen: PropTypes.func,
  setDelete: PropTypes.func,
  setEdit: PropTypes.func,
  setBack: PropTypes.func,
  setSave: PropTypes.func,
  data: PropTypes.object,
};

ToolBar.defaultProps = {
  data: {},
};

const renderBtn = (
  onClick,
  title,
  icon,
  active,
  disabled = false,
  data = null
) => {
  return (
    <>
      {!_.isNil(active) ? (
        <Button
          onClick={onClick}
          icon={icon}
          className={"add-btn"}
          disabled={disabled}
        >
          {title}
        </Button>
      ) : null}
    </>
  );
};
const renderBtnEdit = (
  onClick,
  title,
  icon,
  active,
  disabled = true,
  data = null
) => {
  let options = { class: "edit-btn", disabled: false };
  if (_.isEmpty(data)) {
    options = { class: "", disabled: true };
  }
  return (
    <>
      {!_.isNil(active) ? (
        <Button
          onClick={onClick}
          icon={icon}
          className={options.class}
          disabled={options.disabled}
        >
          {title}
        </Button>
      ) : null}
    </>
  );
};
const renderBtnApprove = (
  onClick,
  title,
  icon,
  active,
  disabled = true,
  data = null
) => {
  let options = { class: "approve-btn", disabled: false };
  if (_.isEmpty(data)) {
    options = { class: "", disabled: true };
  }
  return (
    <>
      {!_.isNil(active) ? (
        <Button
          onClick={onClick}
          icon={icon}
          className={options.class}
          disabled={options.disabled}
        >
          {title}
        </Button>
      ) : null}
    </>
  );
};
const renderBtnConfirm = (objConfirm, label, onClick, title, icon, active) => {
  return (
    <>
      {!_.isNil(active) ? (
        <Popconfirm
          title={title}
          onConfirm={onClick}
          okText="Đồng ý"
          cancelText="Hủy"
          disabled={_.isEmpty(objConfirm)}
        >
          <Button
            icon={icon}
            onClick={() => {
              if (_.isEmpty(objConfirm)) {
                openNotificationWithIcon("error", "Vui lòng chọn phiếu.");
              }
            }}
            disabled={_.isEmpty(objConfirm)}
            className={"delete-btn"}
          >
            {label}
          </Button>
        </Popconfirm>
      ) : null}
    </>
  );
};

export default function ToolBar(props) {
  const {
    data,
    setStateOpen,
    setDelete,
    setEdit,
    setSave,
    setApproval,
    setCreate,
    setStateConfirm,
    titleAdd,
    titleEdit,
    disabled,
    classDefault = "toolBar",
    tittle,
  } = props;
  function clickCreate() {
    setStateOpen();
  }
  function clickXacNhan() {
    setStateConfirm();
  }
  function clickEdit() {
    if (!_.isEmpty(data)) {
      setEdit(data);
    } else {
      openNotificationWithIcon("error", "Vui lòng chọn phiếu cần sửa.");
    }
  }
  function clickDelete() {
    setDelete(data);
  }
  const clickSave = () => {
    setSave();
  };
  const clickApproval = () => {
    if (!_.isEmpty(data)) {
      setApproval(data);
    } else {
      openNotificationWithIcon("error", "Vui lòng chọn phiếu cần duyệt.");
    }
  };

  const clickCreateQU = () => {
    setCreate();
  };
  return (
    <div className={classDefault}>
      <Space>
        {renderBtnConfirm(
          data,
          "Lập báo giá",
          clickCreateQU,
          "Bạn chắc chắn lập báo giá ?",
          <CheckOutlined />,
          setCreate
        )}
        {renderBtn(
          clickCreate,
          !_.isUndefined(titleAdd) ? titleAdd : "Thêm",
          <PlusOutlined />,
          setStateOpen,
          disabled
        )}
        {renderBtn(
          clickXacNhan,
          "Xác nhận",
          <CheckOutlined />,
          setStateConfirm,
          disabled
        )}
        {renderBtnEdit(
          clickEdit,

          !_.isUndefined(titleEdit) ? titleEdit : "Sửa",
          <EditOutlined />,
          setEdit,
          disabled,
          data
        )}
        {renderBtnConfirm(
          data,
          "Xóa",
          clickDelete,
          "Bạn chắc chắn muốn xóa ?",
          <DeleteOutlined />,
          setDelete
        )}
        {renderBtnApprove(
          clickApproval,
          "Duyệt",
          <CheckOutlined />,
          setApproval,
          disabled,
          data
        )}
      </Space>
    </div>
  );
}
