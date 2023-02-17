import React, { useState, useEffect, useRef } from "react";
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
import openNotificationWithIcon from "../../../../common/notification/notification";
// import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import moment from "moment";
import DataGridChamThau from "../../../../common/control/DataGridChamThau";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import { FormatYear } from "../../../controller/Format";

const { TabPane } = Tabs;

function PhanCongChamThau(props) {
  const { columns, columnsDetail, columnsDetailThuoc } = props;
  const dataFetchedRef = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [isObjEdit, setObjEdit] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  const [documentTeam, setDocumentTeam] = useState([]);
  const [lstMarkDetail, setLstMarkDetail] = useState([]);
  const [btnAllot, setBtnAllot] = useState(true);
  const [lstPick, setLstPick] = useState([]);
  const [documentItem, setDocumentItem] = useState();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: "",
    objView: {},
  });

  useEffect(() => {
    setValue("year", moment(new Date()));
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    // dataFetchedRef.current = true;

    //hồ sơ đang chấm thầu, hoàn thành, công bố  hồ sơ
    callApi(
      `odata/BiddingDocuments/Select?$Filter=status_id eq C0935543-E073-41E9-9162-410614383691 or status_id eq B283532F-4DAC-40F7-A4DC-DCFDF71BFC96 or status_id eq 6618BD2E-6AF2-4FAB-8FBE-BD392A37E00C and year eq ${FormatYear(
        watch().year
      )}`,
      "GET"
    ).then((res) => {
      setLstDocument(res.data.value);
    });
  }, [watch().year]);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      handleSearch();
    }
  }, [isStatusModal.isVisible]);

  useEffect(() => {
    console.log("isOpenDrawer.isVisible == false", isOpenDrawer.isVisible);
    if (isOpenDrawer.isVisible == false && !_.isEmpty(watch().document_id)) {
      setLoading(true);
      callApi(
        `odata/Bids?$Expand=assign_tasks&$filter=bidding_document_id eq ${
          watch().document_id
        } and status_id eq 8e6bbebb-687d-451c-8aa2-1a1b6fec989d`
      )
        .then((res) => {
          setLstBider(res.data.value);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon("warning", "Vui lòng thử lại");
          setLoading(false);
        });
    }
  }, [isOpenDrawer.isVisible]);

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

  const selectedRow = (params) => {
    console.log(params);
    setLstPick(params);
    setBtnAllot(false);
  };

  const handleDelete = (params) => {};

  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu");
      return;
    }

    let documentItem = _.find(
      lstDocument,
      (item) => item.id === watch().document_id
    );
    setDocumentItem(documentItem);
    console.log(documentItem);
    // danh sách thành viên chấm nhà thầu
    callApi(
      `odata/BidEvaluationTeams?$expand=members&$filter=id eq ${documentItem.team_id}`,
      "GET"
    ).then((res) => {
      setDocumentTeam(res.data.value[0].members);
    });
    //danh sách nhà thầu mà có trạng thái đang chấm thầu
    setLoading(true);
    callApi(
      `odata/Bids?$Expand=assign_tasks&$filter=bidding_document_id eq ${
        watch().document_id
      } and status_id eq 8e6bbebb-687d-451c-8aa2-1a1b6fec989d`
    )
      .then((res) => {
        setLstBider(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui lòng thử lại");
        setLoading(false);
      });
  };

  const handleAllot = (status = 1) => {
    setStatusModal({
      isVisible: true,
      status,
    });
  };

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
            display: "flex",
            width: "100%",
          }}
        >
          <Col span={3}>
            <YearPickerField
              control={control}
              label="Năm"
              name={"year"}
              placeholder="Chọn năm"
              errors={errors}
            />
          </Col>
          <Col span={3}>
            <Select
              control={control}
              label="Danh sách gói thầu"
              name={"document_id"}
              arrayItem={lstDocument}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
            />
          </Col>

          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleAllot}
              disabled={btnAllot}
            >
              Phân công
            </Button>
          </Col>
        </div>
      </Row>

      <Row
        gutter={[16, 0]}
        className="toolBar"
        style={{ marginLeft: "0px !important" }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            display: "flex",
            width: "100%",
          }}
        >
          <div
            style={{
              justifyContent: "flex-start",

              width: "100%",
            }}
          >
            <div className="gridView">
              <DataGrid
                column={columns}
                data={lstBider}
                dataKey={"id"}
                showFilterRow={true}
                selectionChanged={selectedRow}
                exportExcel={false}
                viewObj={handleOpenDrawer1}
                allowView={true}
                selectionMode="multiple"
              />
            </div>
          </div>
        </div>
      </Row>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          documentTeam={documentTeam}
          lstPick={lstPick}
          setBtnAllot={setBtnAllot}
          documentItem={documentItem}
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

PhanCongChamThau.propTypes = {
  columns: PropTypes.array,
  PhanCongChamThau: PropTypes.object,
};
PhanCongChamThau.defaultProps = {
  columns: [
    {
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "30vw",
    },
    {
      caption: "Người mua",
      dataField: "buyer",
      type: 0,
    },
    {
      caption: "Ngày mua",
      dataField: "buy_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Người nộp",
      dataField: "submitter",
      type: 0,
    },
    {
      caption: "Ngày nộp",
      dataField: "submit_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
    },
    {
      caption: "Số danh mục dự thầu",
      dataField: "count_details",
      type: 0,
    },
    {
      caption: "Số người chấm",
      dataField: "count_assign_tasks",
      type: 0,
    },
  ],
};

export default PhanCongChamThau;
