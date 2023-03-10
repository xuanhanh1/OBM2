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
import openNotificationWithIcon from "../../../../common/notification/notification";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import moment from "moment";
import DataGridChamThau from "../../../../common/control/DataGridChamThau";
import { FormatYear } from "../../../controller/Format";

const { TabPane } = Tabs;

function ThongBaoKQ(props) {
  const { columns, columnsNT } = props;
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
  const [tabActive, setTabActive] = useState();
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [detailBV, setDetailBV] = useState([]);
  const [pickDocument, setPickDocument] = useState();
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
    console.log("watch().year", watch().year);
    if (!_.isEmpty(watch().year)) {
      let year = FormatYear(watch().year);
      callApi(
        `odata/BiddingDocuments/Select?$Filter=status_id eq B283532F-4DAC-40F7-A4DC-DCFDF71BFC96 or status_id eq 6618BD2E-6AF2-4FAB-8FBE-BD392A37E00C and year eq ${year}`
      ).then((res) => {
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
  };

  const handleRowChange = (e) => {
    setDisableBtn(false);
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
              defaultValue={moment(new Date(), "YYYY")}
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
              // loading={isLoading}
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
              // display: "flex",
              width: "100%",
            }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane key={1} tab={"Danh m???c"}>
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
              <TabPane key={2} tab={"Danh m???c theo nh?? th???u"}>
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
            </Tabs>
          </div>
        </Row>
      </Spin>

      {/* {isStatusModal.isVisible ? (
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
      )} */}
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

ThongBaoKQ.propTypes = {
  columns: PropTypes.array,
  ThongBaoKQ: PropTypes.object,
};
ThongBaoKQ.defaultProps = {
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
      caption: "Th??? t??? d??? th???u",
      dataField: "order",
      type: 0,
    },
    // {
    //   caption: "S??? l?????ng",
    //   dataField: "quantity",
    //   type: 0,
    //   width: "5vw",
    //   format: "Money",
    // },
    // {
    //   caption: "????n gi??",
    //   dataField: "plan_price",
    //   type: 0,
    //   format: "Money",
    //   width: "5vw",
    // },
    {
      caption: "????n gi?? k??? ho???ch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "????n gi?? k?? khai",
      dataField: "public_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? sau gi???m gi??",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? sau th????ng th???o",
      dataField: "deal_price",
      type: 0,
      format: "Money",
      total: 1,
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
      caption: "X???p h???ng",
      dataField: "rank",
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

  //group theo nh?? th???u
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
    {
      caption: "Th??? t??? d??? th???u",
      dataField: "order",
      type: 0,
    },
    // {
    //   caption: "S??? l?????ng",
    //   dataField: "quantity",
    //   type: 0,
    //   width: "5vw",
    //   format: "Money",
    // },
    // {
    //   caption: "????n gi??",
    //   dataField: "plan_price",
    //   type: 0,
    //   format: "Money",
    //   width: "5vw",
    // },
    {
      caption: "????n gi?? k??? ho???ch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "????n gi?? k?? khai",
      dataField: "public_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? sau gi???m gi??",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Gi?? sau th????ng th???o",
      dataField: "deal_price",
      type: 0,
      format: "Money",
      total: 1,
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
      caption: "X???p h???ng",
      dataField: "rank",
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

export default ThongBaoKQ;
