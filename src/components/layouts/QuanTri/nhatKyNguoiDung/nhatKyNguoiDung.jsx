import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGridOdata, _, moment } from "../../index";
import PropTypes from "prop-types";
import DrawerChiTiet from "./drawerChiTiet";

function NhatKyNguoiDung(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const [isObjEdit, setObjEdit] = useState({});
  const [urlAuditLog, seturlAuditLog] = useState("/odata/AuditLogs");
  const [optionsOdata, setOptionsOdata] = useState({
    filter: [],
    sort: [{ selector: "execution_time", desc: true }],
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  //Chọn Row Datagrid
  const selectedRow = (selectedObject) => {
    setObjEdit(selectedObject);
  };

  const handleDelete = (params) => {
    // dispatch(deleteDepartments(params.Id));
    if (urlAuditLog === "/odata/AuditLogs") {
      seturlAuditLog("/odata/audtilogs");
    } else {
      seturlAuditLog("/odata/AuditLogs");
    }
  };
  const setUrlApi = (object) => {
    seturlAuditLog(object);
  };
  const handleOpenDrawer = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };
  return (
    <div>
      <PageHeader className="site-page-header" title={"Nhật ký người dùng"} />
      <div className="gridView">
        <DataGridOdata
          column={columns}
          urlApi={urlAuditLog}
          dataKey={"Id"}
          pageSize={20}
          fieldTypes={{
            Id: "Int",
          }}
          showFilterRow={true}
          selectionChanged={selectedRow}
          options={{ ...optionsOdata }}
          viewObj={handleOpenDrawer}
          allowView={true}
        />
      </div>
      <DrawerChiTiet
        isVisible={isOpenDrawer.isVisible}
        setVisible={setOpenDrawer}
        objView={isOpenDrawer.objView}
      />
    </div>
  );
}

NhatKyNguoiDung.propTypes = {
  columns: PropTypes.array,
};
NhatKyNguoiDung.defaultProps = {
  columns: [
    {
      caption: "Ngày",
      dataField: "execution_time",
      type: 0,
      customCellRender: (item) => {
        const date = item.data.execution_time;
        return (
          <div>
            <p>{moment(date).format("DD/MM/YYYY")}</p>
            <p>{moment(date).format("HH:mm:ss")}</p>
          </div>
        );
      },
      width: 120,
      format: "date",
    },
    {
      caption: "Tài khoản",
      dataField: "user_name",
      type: 0,
      width: 120,
    },
    {
      caption: "Phương thức",
      dataField: "method_name",
      type: 0,
      width: 120,
    },
    {
      caption: "Dịch vụ",
      dataField: "service_name",
      type: 0,
    },
    {
      caption: "Url",
      dataField: "url",
      type: 0,
    },
    {
      caption: "IP",
      dataField: "client_ip_address",
      type: 0,
      width: 200,
    },
    {
      caption: "Quốc gia",
      dataField: "country_name",
      type: 0,
      width: 150,
    },
    {
      caption: "Thành phố",
      dataField: "state",
      type: 0,
      width: 150,
    },
    {
      caption: "Trình duyệt",
      dataField: "browser_info",
      type: 0,
    },
  ],
};

export default NhatKyNguoiDung;
