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
// import ModalCreateAndEdit from "./modalCreateAndEdit/ModalCreateAndEdit";
import openNotificationWithIcon from "../../../../common/notification/notification";
// import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import moment from "moment";
import DataGridChamThau from "../../../../common/control/DataGridChamThau";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import ChamThauUpLoadExcel from "./ChamThauUpLoadExcel";
import { FormatYear } from "../../../controller/Format";

const { TabPane } = Tabs;

function ChamThau(props) {
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
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDetail, setLoadingDetail] = useState(false);
  const [tabActive, setTabActive] = useState();
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [detailBV, setDetailBV] = useState([]);
  const [typeId, setTypeId] = useState();
  const [modeId, setModeId] = useState();
  const [pickDocument, setPickDocument] = useState();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  useEffect(() => {
    setValue("year", moment(new Date()));
  }, []);
  useEffect(() => {
    if (!_.isEmpty(watch().year)) {
      let year = !_.isEmpty(watch().year)
        ? `year eq ${FormatYear(watch().year)} `
        : "";
      callApi(
        `odata/BiddingDocuments/Select?$filter=status_id eq c0935543-e073-41e9-9162-410614383691 and ${year}`,
        "GET"
      ).then((res) => {
        setLstBidDocument(res.data.value);
      });
    }
  }, [watch().year]);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      callApi(
        `odata/BidDetails?$Filter=bidding_document_detail_id eq ${tabActive}`
      )
        .then((res) => {
          setLstBider(res.data.value);
        })
        .catch((err) => console.log(err));
    }
  }, [isStatusModal.isVisible]);

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

  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu");
      return;
    }
    // get lst details

    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });
    console.log("lst item", lstItem);
    setTypeId(lstItem.type_id); // loại gói thầu
    setModeId(lstItem.mode_id); // phương thức đấu thầu
    // setLstDetail(lstItem.details); // chi tiết danh mục
    // setTabActive(lstItem.details[0].id);
    // setDetailBV(lstItem.details[0]);
    setPickDocument(watch().document_id); // id của gói thầu
    //get tat ca danh muc
    setLoading(true);
    callApi(
      `odata/BiddingDocumentDetails/GetByBiddingDocument?bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        setLstDetail(res.data);
        // get chi tiết tung danh muc
        setLoading(true);
        callApi(
          `odata/BidDetails?$Filter=is_valid eq true and bidding_document_id eq ${res.data[0].id}`
        )
          .then((res) => {
            setLstBider(res.data.value);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            openNotificationWithIcon("warning", "Vui lòng thử lại chi tiet");
            setLoading(false);
          });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui lòng thử lại tat ca");
        setLoading(false);
      });
  };

  const handleOnChangeTab = (e) => {
    console.log(e);
    setTabActive(e);
    setLoadingDetail(true);
    let lstItem = _.find(lstDetail, function (i) {
      return i.id === e;
    });
    console.log("lstItem", lstItem);

    // setDetailBV(lstItem.details[0])
    callApi(
      `odata/BidDetails?$Filter=is_valid eq true and bidding_document_detail_id eq ${e}`
    )
      .then((res) => {
        setLstBider(res.data.value);
        setLoadingDetail(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui lòng thử lại");
        setLoadingDetail(false);
      });
  };

  return (
    <div>
      {/* search */}
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
              arrayItem={lstBidDocument}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
            />
          </Col>

          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              // loading={isLoading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
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
            // display: "flex",
            width: "100%",
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Cập nhật thủ công">
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
                  <Spin spinning={isLoading}>
                    <Tabs
                      defaultActiveKey="1"
                      tabPosition="left"
                      onChange={(e) => handleOnChangeTab(e)}
                      className="CNTC"
                    >
                      {lstDetail && lstDetail.length > 0
                        ? lstDetail.map((item, index) => {
                            return (
                              <TabPane
                                tab={`${item.medical_supplies_name_byt}`}
                                key={item.id}
                              >
                                {isLoadingDetail ? (
                                  <div style={{ textAlign: "center" }}>
                                    <Spin />
                                  </div>
                                ) : (
                                  <>
                                    <ToolBar
                                      setEdit={() => handleOpenDrawer(1)}
                                      titleEdit="Chấm thầu"
                                      // setDelete={handleDelete}
                                      data={isObjEdit}
                                    />
                                    <div className="gridView">
                                      <DataGridChamThau
                                        column={columns}
                                        data={lstBider}
                                        dataKey={"id"}
                                        showFilterRow={true}
                                        selectionChanged={selectedRow}
                                        exportExcel={false}
                                        viewObj={handleOpenDrawer1}
                                      />
                                    </div>
                                  </>
                                )}
                              </TabPane>
                            );
                          })
                        : null}
                    </Tabs>
                  </Spin>
                </div>
              </Row>
            </TabPane>
            <TabPane tab="Cập nhật bằng file excel " key={"2"}>
              <ChamThauUpLoadExcel
                detailBV={detailBV}
                lstBider={lstBider}
                pickDocument={pickDocument}
                typeId={typeId}
                modeId={modeId}
              />
            </TabPane>
          </Tabs>
        </div>
      </Row>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          id={tabActive}
        />
      ) : (
        <></>
      )}
      {/*  {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null} */}
    </div>
  );
}

ChamThau.propTypes = {
  columns: PropTypes.array,
  ChamThau: PropTypes.object,
};
ChamThau.defaultProps = {
  columns: [
    {
      caption: "Đơn vị mời thầu",
      dataField: "hospital_name",
      type: 0,
    },
    {
      caption: "Đơn vị đấu thầu",
      dataField: "bidder_name",
      type: 0,
    },
    {
      caption: " Hồ sơ mời thầu",
      dataField: "bidding_document_name",
      type: 0,
    },
    {
      caption: "Thứ tự tham gia",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Người mua hồ sơ",
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
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default ChamThau;
