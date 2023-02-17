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
  const [lstStaff, setLstStaff] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    callApi(
      `odata/BidDetails?$Expand=evaluations&$filter=id eq ${objView.id}`
    ).then((res) => {
      console.log("res.data.value.evaluations", res.data.value[0].evaluations);
      setLstStaff(res.data.value[0].evaluations);
    });
  }, []);

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
        title={`Thông tin chi tiết `}
        placement="right"
        width={"40vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <div className="gridView" style={{ height: "calc(100vh - 125px)" }}>
          <DataGrid
            column={columns}
            data={lstStaff}
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
      dataField: "marker_name",
      type: 0,
    },
    {
      caption: "Điểm TCKT",
      dataField: "technical_mark",
      type: 0,
      width: "15vw",
    },
  ],
};

export default DrawerChiTiet;
