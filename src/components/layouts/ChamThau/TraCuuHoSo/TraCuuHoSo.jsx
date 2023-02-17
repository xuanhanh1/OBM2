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
              <TabPane tab="Danh mục hồ sơ mời thầu" key="1">
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
              <TabPane tab="Danh sách danh mục theo nhà thầu" key="4">
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
              <TabPane tab="Danh sách nhà thầu" key="2">
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
              <TabPane tab="Danh sách trúng thầu" key="3">
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
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
    },
    {
      caption: "Quy cách",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "Hạn dùng (tháng)",
      dataField: "expiry",
      type: 0,
      format: "number",
    },
    {
      caption: " Xuất xứ",
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: "SĐK hoặc GPNK",
      dataField: "license ",
      type: 0,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      width: "5vw",
      format: "Money",
    },
    {
      caption: "Đơn giá",
      dataField: "plan_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Tính năng kỹ thuật ",
      dataField: "technical_features",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tỉ lệ đảm bảo dự thầu",
      dataField: "bid_security_rate",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tiền đảm bảo dự thầu",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },

    {
      caption: "Giá nhà thầu",
      dataField: "public_price",
      type: 0,
      format: "Money",
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
      caption: "Thứ tự",
      dataField: "order",
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
  columnsBidder: [
    {
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
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
      caption: "Hồ sơ hợp lệ",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "Hồ sơ không hợp lệ",
      dataField: "is_not_pass_valid",
      type: 0,
    },
  ],
  columnsBidderWin: [
    {
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Tên danh mục",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Quy cách",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "Hạn dùng (tháng)",
      dataField: "expiry",
      type: 0,
      format: "number",
    },
    {
      caption: " Xuất xứ",
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: "SĐK hoặc GPNK",
      dataField: "license ",
      type: 0,
    },
    {
      caption: "Đơn giá nhà thầu",
      dataField: "price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Đơn giá sau thương thảo",
      dataField: "deal_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Điểm nhà thầu",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "Điểm bệnh viện",
      dataField: "technical_mark",
      type: 0,
    },
  ],
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
      //
      group: 0,
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
    },
    {
      caption: "Quy cách",
      dataField: "specification",
      type: 0,
    },
    {
      caption: "Hạn dùng (tháng)",
      dataField: "expiry",
      type: 0,
      format: "number",
    },
    {
      caption: " Xuất xứ",
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: "SĐK hoặc GPNK",
      dataField: "license ",
      type: 0,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      width: "5vw",
      format: "Money",
    },
    {
      caption: "Đơn giá",
      dataField: "plan_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Tính năng kỹ thuật ",
      dataField: "technical_features",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tỉ lệ đảm bảo dự thầu",
      dataField: "bid_security_rate",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tiền đảm bảo dự thầu",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },

    {
      caption: "Giá nhà thầu",
      dataField: "public_price",
      type: 0,
      format: "Money",
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
      caption: "Thứ tự",
      dataField: "order",
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

export default TraCuuHoSo;
