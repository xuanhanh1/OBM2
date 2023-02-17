import React, { useState, useEffect } from "react";
import { PageHeader, Col, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  ToolBar,
  DataGrid,
  _,
  callApi,
  DataGridTCKT,
  Select,
} from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
// import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
function TieuChiKyThuat(props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [lstTeam, setLstTeam] = useState([]);
  const [lstBid, setLstBid] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [lstTechnicalEvaluationTypes, setLstTechnicalEvaluationTypes] =
    useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    callApi(`odata/TechnicalEvaluationTypes?$Expand=details`, "GET").then(
      (res) => {
        console.log("res.data.value[0]", res.data.value[0]);
        setLstTechnicalEvaluationTypes(res.data.value);
        setValue("technical_id", res.data.value[0].id);
      }
    );
  }, []);

  useEffect(() => {
    if (!_.isEmpty(watch().technical_id)) {
      let item = _.find(lstTechnicalEvaluationTypes, function (i) {
        return i.id === watch().technical_id;
      });
      console.log("item", item);
      setLstDetail(item.details);
    }
  }, [watch().technical_id]);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(`odata/TechnicalEvaluationTypes?$Expand=details`, "GET").then(
        (res) => {
          setLstTechnicalEvaluationTypes(res.data.value);
        }
      );
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
      <Row gutter={[8, 0]}>
        <Col span={8}>
          <Select
            control={control}
            label="Tiêu chuẩn đánh giá về kỹ thuật"
            name={"technical_id"}
            arrayItem={lstTechnicalEvaluationTypes}
            valueOpt="id"
            nameOpt="name"
            errors={errors}
          />
        </Col>
      </Row>
      <Col span={24} style={{ paddingTop: "25px" }}>
        <div className="gridView" style={{ height: "calc(100vh - 150px)" }}>
          <DataGridTCKT
            data={lstDetail}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
            exportExcel={false}
            isPick={false}
            isMark={false}
            // allowDeleting={true}
            // selectionMode="multiple"
          />
        </div>
      </Col>
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
      {/* {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null} */}
    </div>
  );
}

TieuChiKyThuat.propTypes = {
  columns: PropTypes.array,
  ITrangThietBis: PropTypes.object,
};
TieuChiKyThuat.defaultProps = {
  columns: [],
};

export default TieuChiKyThuat;
