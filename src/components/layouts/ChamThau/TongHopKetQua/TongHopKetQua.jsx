import React, { useState, useEffect } from "react";
import { Button, Col, Row, Tabs, Spin } from "antd";
import { useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi, moment } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import openNotificationWithIcon from "../../../../common/notification/notification";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import { FormatYear } from "../../../controller/Format";
import NhaThauTrungThau from "../../BaoCao/NhaThauTrungThau/NhaThauTrungThau";
import DMKCoNhaThau from "./DMKCoNhaThau";
import DMNhaThauTrungThau from "./DMNhaThauTrungThau";
import DMKhongTrungThau from "./DMKhongTrungThau";
import DMKLuaChonDuocNT from "./DMKLuaChonDuocNT";

const { TabPane } = Tabs;

function TongHopKetQua(props) {
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
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true);
  const [isPrint, setIsPrint] = useState(false);
  const [lstMarkDetail, setLstMarkDetail] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [lstRecived, setLstRecived] = useState([]);
  const [typeId, setTypeId] = useState();
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  // useEffect(() => {
  //   callApi(`odata/BiddingDocuments`, "GET").then((res) => {
  //     setLstDocument(res.data.value);
  //   });
  // }, []);
  useEffect(() => {
    setValue("year", moment(new Date()));
  }, []);

  useEffect(() => {
    if (!_.isEmpty(watch().year)) {
      let year = FormatYear(watch().year);
      callApi(`odata/BiddingDocuments/Select`).then((res) => {
        setLstDocument(res.data.value);
      });
    }
  }, [watch().year]);

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
    // get lst details
    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });

    // get chi ti???t
    setLoading(true);
    callApi(
      `odata/BiddingDocumentDetails/PublicResult?$Expand=public_results&bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        let data = res.data;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].public_results.length == 0) {
          } else {
            for (let j = 0; j < data[i].public_results.length; j++) {
              arr.push({
                ...data[i],
                ...data[i].public_results[j],
              });
            }
          }
        }
        callApi(
          `odata/BidDetailByHospitals/GetAll?bidding_document_id=${
            watch().document_id
          }`,
          "GET"
        ).then((res) => {
          setLstMarkDetail(res.data.value);
          if (res.data.value.length > 0) {
            setTypeId(res.data.value[0].medical_supplies_type_name);
          }
        });
        setLstBider(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui l??ng th??? l???i");
        setLoading(false);
      });
  };

  const handleRowChange = (e) => {
    setDisableBtn(false);
  };

  const handlePrint = (e) => {
    setLoadingPrint(true);
    setIsPrint(false);
    callApi(
      `odata/BidDetailByHospitals/Win?bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        setLstRecived(res.data.value);
        setLoadingPrint(false);
        setIsPrint(true);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPrint(false);
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
              label="N??m"
              name={"year"}
              placeholder="Ch???n n??m"
              errors={errors}
            />
          </Col>
          <Col span={3}>
            <Select
              control={control}
              label="Danh s??ch g??i th???u"
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
              T??m ki???m
            </Button>
          </Col>

          <Col span={3}>
            <Button
              icon={<PrinterOutlined />}
              loading={loadingPrint}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handlePrint}
            >
              In b??o c??o
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

            width: "100%",
          }}
        >
          <Spin spinning={isLoading}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Ph??? l???c 1" key="1">
                <div className="gridView">
                  <DataGrid
                    column={columns}
                    data={lstBider}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    viewObj={handleOpenDrawer1}
                    handleRowChange={handleRowChange}
                  />
                </div>
              </TabPane>
              <TabPane tab="Ph??? l???c 2 (Theo nh?? th???u) " key="1.5">
                <div className="gridView">
                  <DataGrid
                    column={columnsNT}
                    data={lstBider}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    viewObj={handleOpenDrawer1}
                    handleRowChange={handleRowChange}
                  />
                </div>
              </TabPane>
              <TabPane tab="Chi ti???t " key="2">
                <div className="gridView">
                  <DataGrid
                    column={
                      typeId === "Thu???c" ? columnsDetailThuoc : columnsDetail
                    }
                    data={lstMarkDetail}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    viewObj={handleOpenDrawer1}
                    handleRowChange={handleRowChange}
                  />
                </div>
              </TabPane>

              <TabPane tab="Danh m???c nh?? th???u tr??ng th???u" key="4">
                <DMNhaThauTrungThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh m???c kh??ng c?? nh?? th???u" key="3">
                <DMKCoNhaThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh m???c kh??ng tr??ng th???u" key="5">
                <DMKhongTrungThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh m???c kh??ng l???a ch???n ???????c nh?? th???u" key="6">
                <DMKLuaChonDuocNT documentId={watch().document_id} />
              </TabPane>
            </Tabs>
          </Spin>
        </div>
      </Row>

      {isPrint ? (
        <div style={{ display: "none" }}>
          <NhaThauTrungThau isPrint={isPrint} lstRecived={lstRecived} />
        </div>
      ) : null}
    </div>
  );
}

TongHopKetQua.propTypes = {
  columns: PropTypes.array,
  columnsDetail: PropTypes.array,
  columnsDetailThuoc: PropTypes.array,
  TongHopKetQua: PropTypes.object,
};
TongHopKetQua.defaultProps = {
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
      width: "25vw",
    },
    // {
    //   caption: "Nh??m TCKT",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "10vw",
    // },

    // {
    //   caption: "T??nh n??ng k??? thu???t ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "10vw",
    // },

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
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "Nh?? s???n xu???t",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: "S??K ho???c GPNK",
      dataField: "license ",
      type: 0,
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "??i???m nh?? th???u",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "??i???m b???nh vi???n",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Th??? t???",
      dataField: "order",
      type: 0,
    },
    {
      caption: "H??? s?? h???p l???",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "?????t TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
    {
      caption: "M???i th????ng th???o",
      dataField: "is_deal",
      type: 0,
    },
    {
      caption: "Tr??ng th???u",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],
  // group theo nha thau
  columnsNT: [
    {
      caption: "T??n BYT",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "25vw",
    },
    {
      caption: "",
      dataField: "bidder_name",
      type: 0,
      group: 0,
    },
    // {
    //   caption: "Nh??m TCKT",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "10vw",
    // },

    // {
    //   caption: "T??nh n??ng k??? thu???t ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "10vw",
    // },

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
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "Nh?? s???n xu???t",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: "S??K ho???c GPNK",
      dataField: "license ",
      type: 0,
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "??i???m nh?? th???u",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "??i???m b???nh vi???n",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "S??? ng?????i ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Th??? t???",
      dataField: "order",
      type: 0,
    },
    {
      caption: "H??? s?? h???p l???",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "?????t TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
    {
      caption: "M???i th????ng th???o",
      dataField: "is_deal",
      type: 0,
    },
    {
      caption: "Tr??ng th???u",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],
  // vat tu
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
      caption: "S??? ng?????i ???? ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "??i???m b??nh qu??n",
      dataField: "avg_technical_mark",
      type: 0,
    },
    {
      caption: "K???t qu???",
      dataField: "status_name",
      type: 0,
      width: "9vw",
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

    // {
    //   caption: "Nh??m TCKT ",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "15vw",
    // },
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
      caption: "S??? ng?????i ???? ch???m",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "??i???m b??nh qu??n",
      dataField: "avg_technical_mark",
      type: 0,
    },
    {
      caption: "K???t qu???",
      dataField: "status_name",
      type: 0,
      width: "9vw",
    },
  ],
};

export default TongHopKetQua;
