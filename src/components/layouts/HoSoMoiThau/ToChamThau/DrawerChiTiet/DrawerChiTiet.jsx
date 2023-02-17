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
import { callApi, _, DataGrid } from "../../../index";
import { createTypesDepartment } from "../../../../../redux/actions/DanhMuc";
import { t } from "i18next";
import { FormatMoney } from "../../../../controller/Format";

const { TabPane } = Tabs;
function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns } = props;
  console.log("objView", objView);
  const dispatch = useDispatch();
  const [lstHoliday, setLstHoliday] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

  const selectedRow = ([params]) => {
    // const obj = _.find(lstTinhCong, (x) => x.id === params);
    // console.log("obj ", obj);
    // setObjEdit(obj);
  };

  return (
    <>
      <Drawer
        title={`Thông tin chi tiết thành viên của tổ chấm thầu`}
        placement="right"
        width={"40vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <div className="gridView" style={{ height: "calc(100vh - 125px)" }}>
          <DataGrid
            column={columns}
            data={objView.members}
            allowView={true}
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
};
DrawerChiTiet.defaultProps = {
  columns: [
    {
      caption: "Tên",
      dataField: "staff_name",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
