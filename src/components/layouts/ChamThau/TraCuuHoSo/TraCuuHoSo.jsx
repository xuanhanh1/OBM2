import React, { useState, useEffect } from "react";
import { Button, Col, Row, Tabs, Spin } from "antd";
import { useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi, moment } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

import openNotificationWithIcon from "../../../../common/notification/notification";

import YearPickerField from "../../../../common/control/componentsForm/YearPicker";

import { FormatYear } from "../../../controller/Format";

const { TabPane } = Tabs;

function TraCuuHoSo(props) {
  console.log("render - tracuu");
  const { columns, columnsBidder, columnsBidderWin, columnsNT } = props;
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
  const [lstBidder, setlstBidder] = useState([]);
  const [lstBidderWin, setlstBidderWin] = useState([]);
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);

  const [lstBider, setLstBider] = useState([]);

  const [disableBtn, setDisableBtn] = useState(true);

  const [isPrint, setIsPrint] = useState(false);

  const [loadingPrint, setLoadingPrint] = useState(false);
  const [lstRecived, setLstRecived] = useState([]);
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
    console.log("watch().year", watch().year);
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
        setLstBider(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui l??ng th??? l???i");
        setLoading(false);
      });
    //get all bidder
    callApi(
      `odata/Bids?$filter=bidding_document_id eq ${watch().document_id}`
    ).then((res) => {
      setlstBidder(res.data.value);
      setLoading(false);
    });

    //get bidder win
    callApi(
      `odata/BidDetailByHospitals/Win?bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        setlstBidderWin(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
              <TabPane tab="Danh m???c h??? s?? m???i th???u" key="1">
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
              <TabPane tab="Danh s??ch danh m???c theo nh?? th???u" key="4">
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
              <TabPane tab="Danh s??ch nh?? th???u" key="2">
                <div className="gridView">
                  <DataGrid
                    column={columnsBidder}
                    data={lstBidder}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    viewObj={handleOpenDrawer1}
                    handleRowChange={handleRowChange}
                  />
                </div>
              </TabPane>
              <TabPane tab="Danh s??ch tr??ng th???u" key="3">
                <div className="gridView">
                  <DataGrid
                    column={columnsBidderWin}
                    data={lstBidderWin}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    viewObj={handleOpenDrawer1}
                    handleRowChange={handleRowChange}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Row>
      </Spin>
    </div>
  );
}

TraCuuHoSo.propTypes = {
  columns: PropTypes.array,
  columnsBidderWin: PropTypes.array,
  columnsBidder: PropTypes.array,
  columnsNT: PropTypes.array,
  TraCuuHoSo: PropTypes.object,
};
TraCuuHoSo.defaultProps = {
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
    {
      caption: "Nh??m TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
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
      caption: "S??? l?????ng",
      dataField: "quantity",
      type: 0,
      width: "5vw",
      format: "Money",
    },
    {
      caption: "????n gi??",
      dataField: "plan_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "T??nh n??ng k??? thu???t ",
      dataField: "technical_features",
      type: 0,
      width: "5vw",
    },
    {
      caption: "T??? l??? ?????m b???o d??? th???u",
      dataField: "bid_security_rate",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Ti???n ?????m b???o d??? th???u",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "public_price",
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
  columnsBidder: [
    {
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Ng?????i mua",
      dataField: "buyer",
      type: 0,
    },
    {
      caption: "Ng??y mua",
      dataField: "buy_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Ng?????i n???p",
      dataField: "submitter",
      type: 0,
    },
    {
      caption: "Ng??y n???p",
      dataField: "submit_date",
      type: 0,
      format: "date",
    },

    {
      caption: "H??? s?? h???p l???",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "H??? s?? kh??ng h???p l???",
      dataField: "is_not_pass_valid",
      type: 0,
    },
  ],
  columnsBidderWin: [
    {
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "T??n danh m???c",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
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
      caption: "????n gi?? nh?? th???u",
      dataField: "price",
      type: 0,
      format: "Money",
    },
    {
      caption: "????n gi?? sau th????ng th???o",
      dataField: "deal_price",
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
      dataField: "technical_mark",
      type: 0,
    },
  ],
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
      //
      group: 0,
    },
    {
      caption: "Nh??m TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
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
      caption: "S??? l?????ng",
      dataField: "quantity",
      type: 0,
      width: "5vw",
      format: "Money",
    },
    {
      caption: "????n gi??",
      dataField: "plan_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "T??nh n??ng k??? thu???t ",
      dataField: "technical_features",
      type: 0,
      width: "5vw",
    },
    {
      caption: "T??? l??? ?????m b???o d??? th???u",
      dataField: "bid_security_rate",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Ti???n ?????m b???o d??? th???u",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "public_price",
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
};

export default TraCuuHoSo;
