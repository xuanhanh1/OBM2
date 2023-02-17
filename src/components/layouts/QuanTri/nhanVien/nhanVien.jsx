import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, useLocalStorage, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
import openNotificationWithIcon from "../../../../common/notification/notification";

function NhanVien(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [lsStaff, setLstStaff] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/Staffs?$filter=bidder_id eq null`, "GET").then((res) => {
        setLstStaff(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);

  useEffect(() => {
    callApi(`odata/Staffs?$filter=bidder_id eq null`, "GET").then((res) => {
      setLstStaff(res.data.value);
    });
  }, []);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lsStaff, (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleDelete = (params) => {
    callApi(`odata/Staffs?key=${params.id}`, "DELETE").then((res) => {
      openNotificationWithIcon("success", "Xoá thành công");
      callApi(`odata/Staffs?$filter=bidder_id eq null`, "GET").then((res) => {
        setLstStaff(res.data.value);
      });
    });
  };

  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        setDelete={handleDelete}
        data={isObjEdit}
      />

      <div className="gridView">
        <DataGrid
          column={columns}
          data={lsStaff}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

NhanVien.propTypes = {
  columns: PropTypes.array,
  INhanViens: PropTypes.object,
};
NhanVien.defaultProps = {
  columns: [
    {
      caption: "Mã nhân viên",
      dataField: "code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tên nhân viên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Ngày sinh",
      dataField: "date_of_birth",
      type: 0,
      width: "5vw",
      format: "date",
    },
    {
      caption: "Điện thoại",
      dataField: "phone",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Địa chỉ",
      dataField: "address",
      type: 0,
    },
    {
      caption: "Email",
      dataField: "email",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Tên chức vụ",
      dataField: "position_name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "UserName",
      dataField: "user_name",
      type: 0,
      width: "5vw",
    },
  ],
};

export default NhanVien;
