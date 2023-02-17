import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./modalCreateAndEdit/ModalCreateAndEdit";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
function ToChamThau(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [lstTeam, setLstTeam] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    callApi(`odata/BidEvaluationTeams?$expand=members`, "GET").then((res) => {
      setLstTeam(res.data.value);
    });
  }, []);
  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/BidEvaluationTeams?$expand=members`, "GET").then((res) => {
        setLstTeam(res.data.value);
      });
    }
  }, [isStatusModal.isVisible]);

  const handleOpenDrawer = (status) => {
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

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstTeam, (x) => x.Id === params);
    setObjEdit(obj);
  };
  return (
    <div>
      {/* <PageHeader className="site-page-header" title={t("VaiTroNguoiDung")} /> */}
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        data={isObjEdit}
      />

      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstTeam}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          exportExcel={false}
          allowView={true}
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
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );
}

ToChamThau.propTypes = {
  columns: PropTypes.array,
  ITrangThietBis: PropTypes.object,
};
ToChamThau.defaultProps = {
  columns: [
    {
      caption: "Mã tổ chấm thầu",
      dataField: "code",
      type: 0,
    },
    {
      caption: "Tên tổ chấm thầu",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Tổ trưởng tổ chấm thầu",
      dataField: "leader_name",
      type: 0,
    },
    {
      caption: "Ghi chu",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ToChamThau;
