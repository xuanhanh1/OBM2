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
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import moment from "moment";
import DataGridChamThau from "../../../../common/control/DataGridChamThau";
// import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
// import ChamThauUpLoadExcel from "./ChamThauUpLoadExcel";

const { TabPane } = Tabs;

function KQChamThauKT(props) {
  const { columns, columnsDetail, columnsDetailThuoc, columnsNT } = props;

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
  const [isLoadingGetAll, setLoadingGetAll] = useState(false);
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [lstMarkDetail, setLstMarkDetail] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {}, []);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
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
      openNotificationWithIcon("warning", "Vui l??ng ch???n g??i th???u");
      return;
    }
    setLoading(true);
    // get lst details
    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });

    // get chi ti???t
    setLoading(true);
    callApi(
      `odata/TechnicalResults?$filter=bidding_document_id eq ${
        watch().document_id
      }`
    )
      .then((res) => {
        let data = res.data;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].results.length == 0) {
            arr.push(data[i]);
          } else {
            for (let j = 0; j < data[i].results.length; j++) {
              arr.push({
                ...data[i],
                ...data[i].results[j],
              });
            }
          }
        }
        setLstBider(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui l??ng th??? l???i");
        setLoading(false);
      });
    setLoadingGetAll(true);
    callApi(
      `odata/BidDetailByHospitals/GetAll?bidding_document_id=${
        watch().document_id
      }`,
      "GET"
    )
      .then((res) => {
        setLstMarkDetail(res.data.value);
        setLoadingGetAll(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingGetAll(false);
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
            <Select
              control={control}
              label="Danh s??ch g??i th???u"
              name={"document_id"}
              arrayItem={`odata/BiddingDocuments/Select?$filter=status_id eq C0935543-E073-41E9-9162-410614383691 or status_id eq B283532F-4DAC-40F7-A4DC-DCFDF71BFC96 or status_id eq 6618BD2E-6AF2-4FAB-8FBE-BD392A37E00C`}
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
              T??m ki???m
            </Button>
          </Col>
        </div>
      </Row>

      <Spin spinning={isLoading}>
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
            <Tabs defaultActiveKey="1">
              <TabPane tab="??i???m ch???m TCKT" key="1">
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
                      showPager={true}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="??i???m ch???m TCKT (Danh m???c theo nh?? th???u)" key="1.5">
                <div
                  style={{
                    justifyContent: "flex-start",

                    width: "100%",
                  }}
                >
                  <div className="gridView">
                    <DataGrid
                      column={columnsNT}
                      data={lstBider}
                      dataKey={"id"}
                      showFilterRow={true}
                      selectionChanged={selectedRow}
                      exportExcel={false}
                      viewObj={handleOpenDrawer1}
                      allowView={true}
                      showPager={true}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Danh s??ch nh?? th???u kh??ng ?????t" key="1.7">
                <div
                  style={{
                    justifyContent: "flex-start",

                    width: "100%",
                  }}
                >
                  <div className="gridView">
                    <DataGrid
                      column={columns}
                      data={_.filter(lstBider, function (i) {
                        return i.is_pass_technical == false;
                      })}
                      dataKey={"id"}
                      showFilterRow={true}
                      selectionChanged={selectedRow}
                      exportExcel={false}
                      viewObj={handleOpenDrawer1}
                      allowView={true}
                      showPager={true}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Chi ti???t ??i???m TCKT" key={"2"}>
                <Spin spinning={isLoadingGetAll}>
                  <div
                    style={{
                      justifyContent: "flex-start",

                      width: "100%",
                    }}
                  >
                    <div className="gridView">
                      <DataGrid
                        column={
                          lstMarkDetail &&
                          lstMarkDetail.length > 0 &&
                          lstMarkDetail[0].medical_supplies_type_name ===
                            "Thu???c"
                            ? columnsDetailThuoc
                            : columnsDetail
                        }
                        data={lstMarkDetail}
                        dataKey={"id"}
                        showFilterRow={true}
                        selectionChanged={selectedRow}
                        exportExcel={false}
                        viewObj={handleOpenDrawer1}
                        showPager={true}
                      />
                    </div>
                  </div>
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </Row>
      </Spin>
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

KQChamThauKT.propTypes = {
  columns: PropTypes.array,
  KQChamThauKT: PropTypes.object,
  columnsDetail: PropTypes.array,
  columnsDetailThuoc: PropTypes.array,
};
KQChamThauKT.defaultProps = {
  columns: [
    {
      caption: "",
      dataField: "medical_supplies_name_byt",
      type: 0,
      group: 0,
    },
    {
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "30vw",
    },
    {
      caption: "Quy c??ch",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "H???n d??ng (th??ng)",
      dataField: "expiry",
      type: 0,
      format: "number",
    },
    {
      caption: " Xu???t x???",
      dataField: "origin",
      type: 0,
    },
    {
      caption: "Nh?? s???n xu???t",
      dataField: "producer",
      type: 0,
    },
    {
      caption: "S??K ho???c GPNK",
      dataField: "license",
      type: 0,
    },
    {
      caption: "??i???m nh?? th???u",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "??i???m b???nh vi???n ch???m ",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i b???nh vi???n ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "?????t TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
  ],
  //group theo nh?? th???u
  columnsNT: [
    {
      caption: "T??n BYT",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "30vw",
    },
    {
      caption: " ",
      dataField: "bidder_name",
      type: 0,
      group: 0,
    },
    {
      caption: "Quy c??ch",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "H???n d??ng (th??ng)",
      dataField: "expiry",
      type: 0,
      format: "number",
    },
    {
      caption: " Xu???t x???",
      dataField: "origin",
      type: 0,
    },
    {
      caption: "Nh?? s???n xu???t",
      dataField: "producer",
      type: 0,
    },
    {
      caption: "S??K ho???c GPNK",
      dataField: "license",
      type: 0,
    },
    {
      caption: "??i???m nh?? th???u",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "??i???m b???nh vi???n ch???m ",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i b???nh vi???n ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "?????t TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
  ],
  columnsDetail: [
    {
      caption: "",
      dataField: "medical_supplies_name_byt",
      type: 0,
      group: 0,
    },
    {
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "C??ch ????nh gi?? k??? thu???t",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "15vw",
    },

    {
      caption: "Nh??m TCKT ",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Ti??u chu???n 1.1 ",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 1.2 ",
      dataField: "d12_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 2 ",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 3  ",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 4  ",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 5  ",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 6  ",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 7  ",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 8  ",
      dataField: "d8_bv",
      type: 0,
    },
    {
      caption: "T???ng ??i???m",
      dataField: "technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i ???? ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "??i???m b??nh qu??n",
      dataField: "avg_technical_mark",
      type: 0,
    },
  ],
  columnsDetailThuoc: [
    {
      caption: "",
      dataField: "medical_supplies_name_byt",
      type: 0,
      group: 0,
    },
    {
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "C??ch ????nh gi?? k??? thu???t",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "15vw",
    },

    {
      caption: "Nh??m TCKT ",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Ti??u chu???n 1 ",
      dataField: "d1_bv",
      type: 0,
    },

    {
      caption: "Ti??u chu???n 2 ",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 3  ",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 4  ",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 5  ",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 6  ",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 7  ",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 8  ",
      dataField: "d8_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 10  ",
      dataField: "d10_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 11  ",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 12  ",
      dataField: "d12_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 13  ",
      dataField: "d13_bv",
      type: 0,
    },
    {
      caption: "Ti??u chu???n 14  ",
      dataField: "d14_bv",
      type: 0,
    },

    {
      caption: "T???ng ??i???m",
      dataField: "technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i ???? ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "??i???m b??nh qu??n",
      dataField: "avg_technical_mark",
      type: 0,
    },
  ],
};

export default KQChamThauKT;
