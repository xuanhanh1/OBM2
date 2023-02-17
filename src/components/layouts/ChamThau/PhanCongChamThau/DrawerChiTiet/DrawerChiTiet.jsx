import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Row,
  Col,
  Descriptions,
  Button,
  Checkbox,
  Tabs,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { callApi, _, DataGrid, ToolBar } from "../../../index";
import { createTypesDepartment } from "../../../../../redux/actions/DanhMuc";
import { t } from "i18next";
import { FormatMoney } from "../../../../controller/Format";
import openNotificationWithIcon from "../../../../../common/notification/notification";

const { TabPane } = Tabs;
function DrawerChiTiet(props) {
  const {
    isVisible,
    setVisible,
    objView,
    columns,
    columnsBidder,
    isPHHS = false,
  } = props;
  console.log("objView", objView);
  const dispatch = useDispatch();
  const [lstBidder, setLstBidder] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [lstBidder1, setLstBidder1] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

  useEffect(() => {}, []);

  const selectedRow = ([params]) => {
    console.log("params", params);
    setObjEdit(params);
  };

  const handleDelete = () => {
    callApi(
      `odata/AssignTasks?key=${isObjEdit}
      `,
      "DELETE"
    )
      .then((res) => {
        openNotificationWithIcon("success", "Xóa thành viên thành công");
        onClose();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Drawer
        title={`Danh sách nhân viên chấm thầu
        
        `}
        placement="right"
        width={"40vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <ToolBar setDelete={handleDelete} data={isObjEdit} />
        <div className="gridView" style={{ height: "calc(100vh - 125px)" }}>
          <DataGrid
            column={columns}
            data={objView.assign_tasks}
            showPager={true}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
          />
        </div>
      </Drawer>
    </>
  );
}

DrawerChiTiet.defaultProps = {
  columns: PropTypes.array,
  columnsBidder: PropTypes.array,
};
DrawerChiTiet.defaultProps = {
  columns: [
    {
      caption: "Tên",
      dataField: "member_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Tên công ty",
      dataField: "bidder_name",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
