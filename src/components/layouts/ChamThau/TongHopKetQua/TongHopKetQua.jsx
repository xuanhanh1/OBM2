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
        openNotificationWithIcon("warning", "Vui lòng thử lại");
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

          <Col span={3}>
            <Button
              icon={<PrinterOutlined />}
              loading={loadingPrint}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handlePrint}
            >
              In báo cáo
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
              <TabPane tab="Phụ lục 1" key="1">
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
              <TabPane tab="Phụ lục 2 (Theo nhà thầu) " key="1.5">
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
              <TabPane tab="Chi tiết " key="2">
                <div className="gridView">
                  <DataGrid
                    column={
                      typeId === "Thuốc" ? columnsDetailThuoc : columnsDetail
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

              <TabPane tab="Danh mục nhà thầu trúng thầu" key="4">
                <DMNhaThauTrungThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh mục không có nhà thầu" key="3">
                <DMKCoNhaThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh mục không trúng thầu" key="5">
                <DMKhongTrungThau documentId={watch().document_id} />
              </TabPane>
              <TabPane tab="Danh mục không lựa chọn được nhà thầu" key="6">
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
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    // {
    //   caption: "Nhóm TCKT",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "10vw",
    // },

    // {
    //   caption: "Tính năng kỹ thuật ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "10vw",
    // },

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
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
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
  // group theo nha thau
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
    // {
    //   caption: "Nhóm TCKT",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "10vw",
    // },

    // {
    //   caption: "Tính năng kỹ thuật ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "10vw",
    // },

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
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
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
  // vat tu
  columnsDetail: [
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
      caption: "Cách đánh giá kỹ thuật",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "15vw",
    },

    {
      caption: "Nhóm TCKT ",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Tiêu chuẩn 1.1 ",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 1.2 ",
      dataField: "d12_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 2 ",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 3  ",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 4  ",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 5  ",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 6  ",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 7  ",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 8  ",
      dataField: "d8_bv",
      type: 0,
    },

    {
      caption: "Số người đã chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Điểm bình quân",
      dataField: "avg_technical_mark",
      type: 0,
    },
    {
      caption: "Kết quả",
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
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Cách đánh giá kỹ thuật",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "15vw",
    },

    // {
    //   caption: "Nhóm TCKT ",
    //   dataField: "technical_criteria_group_name",
    //   type: 0,
    //   width: "15vw",
    // },
    {
      caption: "Tiêu chuẩn 1 ",
      dataField: "d1_bv",
      type: 0,
    },

    {
      caption: "Tiêu chuẩn 2 ",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 3  ",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 4  ",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 5  ",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 6  ",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 7  ",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 8  ",
      dataField: "d8_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 10  ",
      dataField: "d10_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 11  ",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 12  ",
      dataField: "d12_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 13  ",
      dataField: "d13_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 14  ",
      dataField: "d14_bv",
      type: 0,
    },

    {
      caption: "Số người đã chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Điểm bình quân",
      dataField: "avg_technical_mark",
      type: 0,
    },
    {
      caption: "Kết quả",
      dataField: "status_name",
      type: 0,
      width: "9vw",
    },
  ],
};

export default TongHopKetQua;
