import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer } from "antd";
import { useDispatch } from "react-redux";
import { callApi, _, DataGrid, ToolBar } from "../../../index";

import CreateAndEditStaffBidder from "./CreateAndEditStaffBidder";
import openNotificationWithIcon from "../../../../../common/notification/notification";
function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns } = props;
  const dispatch = useDispatch();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const [isObjEdit, setObjEdit] = useState({});
  const [lstStaffBidder, setLstStaffBidder] = useState([]);
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  useEffect(() => {
    callApi(`odata/StaffBidders?$filter=bidder_id eq ${objView.id}`)
      .then((res) => {
        setLstStaffBidder(res.data.value);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/StaffBidders?$filter=bidder_id eq ${objView.id}`)
        .then((res) => {
          setLstStaffBidder(res.data.value);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [isStatusModal.isVisible]);

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };
  const selectedRow = ([params]) => {
    const obj = _.find(lstStaffBidder, (x) => x.id === params);
    setObjEdit(obj);
  };
  const handleDelete = (params) => {
    console.log("params", params.id);
    callApi(`odata/StaffBidders?key=${params.id}`, "DELETE")
      .then((res) => {
        openNotificationWithIcon("success", "X??a nh??n vi??n th??nh c??ng !");
        callApi(`odata/StaffBidders?$filter=bidder_id eq ${objView.id}`)
          .then((res) => {
            setLstStaffBidder(res.data.value);
          })
          .catch((err) => {
            console.log(err.response);
          });
      })
      .catch((err) => {
        console.log(err.response);
        openNotificationWithIcon("error", "X??a nh??n vi??n th???t b???i !");
      });
  };

  return (
    <>
      <Drawer
        title={`Th??ng tin nh??n vi??n`}
        placement="right"
        width={"50vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <ToolBar
          setStateOpen={() => handleOpenDrawer(0)}
          setEdit={() => handleOpenDrawer(1)}
          setDelete={handleDelete}
          data={isObjEdit}
        />
        <div className="gridView">
          <DataGrid
            column={columns}
            data={lstStaffBidder}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
            exportExcel={false}
          />
        </div>
        {isStatusModal.isVisible ? (
          <CreateAndEditStaffBidder
            isVisible={isStatusModal.isVisible}
            setVisible={setStatusModal}
            isStatus={isStatusModal.status}
            objEdit={isObjEdit}
            setObjEdit={setObjEdit}
            objView={objView}
          />
        ) : (
          <></>
        )}
      </Drawer>
    </>
  );
}

DrawerChiTiet.defaultProps = {
  columns: PropTypes.array,
};

DrawerChiTiet.defaultProps = {
  columns: [
    {
      caption: "M?? nh??n vi??n",
      dataField: "code",
      type: 0,
    },
    {
      caption: "T??n nh??n vi??n",
      dataField: "name",
      type: 0,
    },
    {
      caption: "?????a ch???",
      dataField: "address",
      type: 0,
    },
    {
      caption: "S??? ??i???n tho???i",
      dataField: "phone",
      type: 0,
    },
    {
      caption: "Username",
      dataField: "username",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
