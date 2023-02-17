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
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu");
      return;
    }
    // get lst details

    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });

    // get chi tiết
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
        openNotificationWithIcon("warning", "Vui lòng thử lại");
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
              label="Năm"
              name={"year"}
              placeholder="Chọn năm"
              errors={errors}
              defaultValue={moment(new Date(), "YYYY")}
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
              <TabPane key={1} tab={"Danh mục"}>
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
              <TabPane key={2} tab={"Danh mục theo nhà thầu"}>
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
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Thứ tự dự thầu",
      dataField: "order",
      type: 0,
    },
    // {
    //   caption: "Số lượng",
    //   dataField: "quantity",
    //   type: 0,
    //   width: "5vw",
    //   format: "Money",
    // },
    // {
    //   caption: "Đơn giá",
    //   dataField: "plan_price",
    //   type: 0,
    //   format: "Money",
    //   width: "5vw",
    // },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Đơn giá kê khai",
      dataField: "public_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá sau giảm giá",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá sau thương thảo",
      dataField: "deal_price",
      type: 0,
      format: "Money",
      total: 1,
    },
    {
      caption: "Điểm nhà thầu",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "Điểm bệnh viện",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "Số người chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Xếp hạng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Hồ sơ hợp lệ",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "Đạt TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
    {
      caption: "Mời thương thảo",
      dataField: "is_deal",
      type: 0,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],

  //group theo nhà thầu
  columnsNT: [
    {
      caption: "Tên BYT",
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
      caption: "Thứ tự dự thầu",
      dataField: "order",
      type: 0,
    },
    // {
    //   caption: "Số lượng",
    //   dataField: "quantity",
    //   type: 0,
    //   width: "5vw",
    //   format: "Money",
    // },
    // {
    //   caption: "Đơn giá",
    //   dataField: "plan_price",
    //   type: 0,
    //   format: "Money",
    //   width: "5vw",
    // },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Đơn giá kê khai",
      dataField: "public_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá sau giảm giá",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Giá sau thương thảo",
      dataField: "deal_price",
      type: 0,
      format: "Money",
      total: 1,
    },
    {
      caption: "Điểm nhà thầu",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "Điểm bệnh viện",
      dataField: "hospital_technical_mark",
      type: 0,
    },
    {
      caption: "Số người chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Xếp hạng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Hồ sơ hợp lệ",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "Đạt TCKT",
      dataField: "is_pass_technical",
      type: 0,
    },
    {
      caption: "Mời thương thảo",
      dataField: "is_deal",
      type: 0,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],
};

export default ThongBaoKQ;
