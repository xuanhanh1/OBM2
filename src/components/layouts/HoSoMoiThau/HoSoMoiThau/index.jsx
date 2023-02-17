import React, { useState, useEffect } from "react";
import { Spin, Button, Col, Row, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, Select, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import HoSoMoiThau from "./HoSoMoiThau";

const { TabPane } = Tabs;

function HSMT(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [isObjEdit, setObjEdit] = useState({});
  const [lstBider, setLstBider] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
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

  const selectedRow = ([params]) => {
    const obj = _.find(lstBider, (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleDelete = (params) => {};

  const handleSearch = () => {};

  const handleOnChangeTab = (e) => {};

  return (
    <div>
      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            // display: "flex",
            width: "100%",
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tạo mới hồ sơ " key="1">
              <HoSoMoiThau />
            </TabPane>
            <TabPane tab="Phát hành hồ sơ  " key={"2"}></TabPane>
          </Tabs>
        </div>
      </Row>
    </div>
  );
}

HSMT.propTypes = {
  columns: PropTypes.array,
  HSMT: PropTypes.object,
};
HSMT.defaultProps = {
  columns: [],
};

export default HSMT;
