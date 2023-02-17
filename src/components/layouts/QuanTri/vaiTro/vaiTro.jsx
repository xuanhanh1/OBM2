import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _ } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/modalCreateAndEdit";
function VaiTro(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lstRoles = useSelector((state) => state.QuanTriReducers.lstRoles);
  const [isObjEdit, setObjEdit] = useState({});
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  useEffect(() => {
    dispatch(getAllRoles());
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
    const obj = _.find(lstRoles, (x) => x.Id === params);
    setObjEdit(obj);
  };
  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        setEdit={() => handleOpenDrawer(1)}
        data={isObjEdit}
      />
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstRoles}
          dataKey={"Id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
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

VaiTro.propTypes = {
  columns: PropTypes.array,
  ITrangThietBis: PropTypes.object,
};
VaiTro.defaultProps = {
  columns: [
    {
      caption: "Tên vai trò",
      dataField: "NAME",
      type: 0,
    },
    {
      caption: "Mặc định",
      dataField: "ISDEFAULT",
      type: 0,
    },
  ],
};

export default VaiTro;
