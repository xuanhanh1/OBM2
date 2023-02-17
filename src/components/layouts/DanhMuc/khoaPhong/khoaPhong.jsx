import PropTypes from "prop-types";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../common/notification/notification";

import { ToolBar, DataGrid, callApi, _ } from "../../index";

import DrawerKhoaPhong from "./DrawerKhoaPhong/DrawerKhoaPhong";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";

function KhoaPhong(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [lstDepartment, setLstDepartment] = useState([]);
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    callApi(`odata/Departments`).then((res) => {
      setLstDepartment(res.data.value);
    });
  }, []);
  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/Departments`).then((res) => {
        setLstDepartment(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };
  const handleOpenDrawer1 = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstDepartment, (x) => x.id === params);

    setObjEdit(obj);
  };

  const handleDelete = (params) => {
    callApi(`odata/Departments?key=${params.id}`, "DELETE")
      .then((res) => {
        openNotificationWithIcon("success", "Xóa khoa phòng thành công !");
        callApi(`odata/Departments`).then((res) => {
          setLstDepartment(res.data.value);
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        openNotificationWithIcon("error", "Xóa khoa phòng thất bại !");
      });
  };

  const handleOpenDrawerKhoaPhong = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const handleClick = () => {
    document.querySelector(".dx-button-content").click();
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
          data={lstDepartment}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={true}
          viewObj={handleOpenDrawer1}
        />
      </div>
      {isStatusModal.isVisible && (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          lstDepartment={lstDepartment}
        />
      )}
      {isOpenDrawer.isVisible && (
        <DrawerKhoaPhong
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      )}
    </div>
  );
}

KhoaPhong.propTypes = {
  columns: PropTypes.array,
  IDepartments: PropTypes.object,
};
KhoaPhong.defaultProps = {
  columns: [
    {
      caption: "Tên bệnh viện",
      dataField: "hospital_name",
      type: 0,
    },
    {
      caption: "Mã khoa/phòng",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng trực thuộc",
      dataField: "department_parent_name",
      type: 0,
    },
    {
      caption: "Lãnh đạo",
      dataField: "leader",
      type: 0,
    },
    {
      caption: "Điện thoại",
      dataField: "phone",
      type: 0,
    },
  ],
};

export default KhoaPhong;
