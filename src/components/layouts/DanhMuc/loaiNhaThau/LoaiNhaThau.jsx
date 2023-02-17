import { PrinterOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import openNotificationWithIcon from "../../../../common/notification/notification";
import { deleteDepartments } from "../../../../redux/actions/DanhMuc";
import { DataGridOdata, ToolBar, callApi, _, DataGrid } from "../../index";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";

// import DrawerKhoaPhong from "./DrawerKhoaPhong/DrawerKhoaPhong";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
function KhoaPhong(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [lstBidder, setLstBidder] = useState([]);
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };

  useEffect(() => {
    callApi(`odata/Bidders`, "GET")
      .then((res) => {
        setLstBidder(res.data.value);
      })
      .catch((err) => {
        openNotificationWithIcon("warning", err.response.data.errors[0]);
      });
  }, []);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/Bidders`, "GET")
        .then((res) => {
          setLstBidder(res.data.value);
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        });
    }
  }, [isStatusModal.isVisible]);

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstBidder, (x) => x.id === params);

    setObjEdit(obj);
  };

  const handleDelete = (params) => {
    console.log("params", params);
    callApi(`odata/Bidders?key=${params.id}`, "DELETE")
      .then((res) => {
        openNotificationWithIcon("success", "Xóa nhà thầu thành công !");
        callApi(`odata/Bidders`).then((res) => {
          setLstBidder(res.data.value);
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        openNotificationWithIcon("error", "Xóa nhà thầu thất bại !");
      });
  };

  const handleOpenDrawerKhoaPhong = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
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
          data={lstBidder}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={true}
          viewObj={handleOpenDrawer1}
          allowView={true}
        />
      </div>
      {isStatusModal.isVisible && (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      )}
      {isOpenDrawer.isVisible && (
        <DrawerChiTiet
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
      caption: "Mã nhà thầu",
      dataField: "code", // dữ liệu đang là null
      type: 0,
    },
    {
      caption: "Tên nhà thầu viết tắt",
      dataField: "shortcut_name",
      type: 0,
    },
    {
      caption: "Tên nhà thầu",
      dataField: "name",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Địa chỉ",
      dataField: "address",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Số điện thoại",
      dataField: "phone",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Email",
      dataField: "email",
      type: 0,
    },
    {
      caption: "Loại nhà thầu",
      dataField: "bidder_type_name",
      type: 0,
    },
  ],
};

export default KhoaPhong;
