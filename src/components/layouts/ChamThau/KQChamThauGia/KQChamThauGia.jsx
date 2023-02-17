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

function KQChamThauGia(props) {
  const { columns, columnsDetail, columns22 } = props;
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
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [mode, setMode] = useState();
  const [isPrice, setIsPrice] = useState();
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
    // status_id eq C0935543-E073-41E9-9162-410614383691 and
    let year = !_.isEmpty(watch().year)
      ? `year eq ${FormatYear(watch().year)} `
      : "";
    if (!_.isEmpty(watch().year) && !_.isEmpty(watch().mode_id)) {
      callApi(
        `odata/BiddingDocuments/Select?$filter=mode_id eq ${
          watch().mode_id
        } and status_id eq C0935543-E073-41E9-9162-410614383691 and ${year}`, // đang chấm thầu
        "GET"
      ).then((res) => {
        setLstDocument(res.data.value);
      });
    }
  }, [watch().mode_id, watch().year]);

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

    // //da ket thuc thoi gian cham gia hay chua
    // setIsPrice(lstItem.is_update_price);
    // get chi tiết
    setLoading(true);
    setMode(watch().mode_id);
    callApi(
      `odata/BiddingDocumentDetails/GetPrice?$Expand=prices&bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        let data = res.data;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].prices.length == 0) {
          } else {
            for (let j = 0; j < data[i].prices.length; j++) {
              arr.push({
                ...data[i],
                ...data[i].prices[j],
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

  const handleUpdate = () => {
    const obj = _.find(lstDocument, (x) => x.id === watch().document_id);
    console.log("obj", obj);
    if (obj.status_id === "b283532f-4dac-40f7-a4dc-dcfdf71bfc96") {
      openNotificationWithIcon(
        "warning",
        "Gói thầu đã được công khai, không được sửa"
      );
      return;
    }
    // khi chua ket thuc thoi gian nhap gia thi k cho cập nhật trúng thau và phương thức đấu thầu là 2 túi 2 hồ sơ
    if (
      obj.status_update_price !== "Kết thúc thời gian nhập giá" &&
      obj.mode_id === "866c83e5-2edd-4f26-bfd4-0b0a4694319c"
    ) {
      openNotificationWithIcon("warning", "Chưa đến thời gian chấm thầu");
      return;
    }
    setLoadingUpdate(true);
    let newData = lstBider.map((item) => {
      return {
        ...item,
        bid_detail_id: item.id,
      };
    });

    callApi(`odata/BidDetails/UpdateFinancial`, "PUT", newData)
      .then((res) => {
        setLoadingUpdate(false);

        openNotificationWithIcon("success", "Duyệt hồ sơ thành công");
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
        setLoadingUpdate(false);
      });
  };

  const handleRowChange = (e) => {
    setDisableBtn(false);
  };

  const handleCandelPrice = () => {
    let itemDocument = _.find(lstDocument, function (i) {
      return i.id === watch().document_id;
    });
    // console.log("itemDocument", itemDocument);
    if (
      itemDocument &&
      itemDocument.status_update_price === "Kết thúc thời gian nhập giá"
    ) {
      openNotificationWithIcon("success", "Đã kết thúc thời gian nhập giá");
      return;
    }

    callApi(
      `odata/BiddingDocuments/FinishUpdatePrice?key=${watch().document_id}`,
      "PUT"
    )
      .then((res) => {
        // setLoadingUpdate(false);

        openNotificationWithIcon("success", "Kết thúc quá trình sửa giá");
        handleSearch();
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
        // setLoadingUpdate(false);
      });
  };

  const handleDefaul = async () => {
    setLoading(true);
    console.log("lstBider", lstBider);
    await lstBider.map((item) => {
      if (item.rank == 1) {
        item.is_pass = true;
      }
    });
    setLoading(false);
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
            />
          </Col>
          <Col span={3}>
            <Select
              control={control}
              label="Phương thức đấu thầu"
              name={"mode_id"}
              arrayItem={`odata/BiddingModes`}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
              required
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

          <Col span={4}>
            <Button
              loading={loadingUpdate}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdate}
              disabled={disableBtn}
            >
              Cập nhật danh mục trúng thầu
            </Button>
          </Col>
          {mode === "866c83e5-2edd-4f26-bfd4-0b0a4694319c" && (
            <Col span={4}>
              <Button
                // loading={loadingUpdate}
                type="primary"
                style={{ marginTop: 22, color: "white" }}
                onClick={handleCandelPrice}
                // disabled={disableBtn}
              >
                Kết thúc thời gian nhập giá
              </Button>
            </Col>
          )}
          <Col span={4}>
            <Button
              loading={isLoading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleDefaul}
            >
              Chấm mặc định
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

              width: "100%",
            }}
          >
            <div className="gridView">
              <DataGrid
                column={
                  mode === "e46f4f15-05e4-48c0-ac22-2be87b4dca93"
                    ? columns
                    : columns22
                }
                data={lstBider}
                dataKey={"id"}
                showFilterRow={true}
                selectionChanged={selectedRow}
                exportExcel={false}
                viewObj={handleOpenDrawer1}
                handleRowChange={handleRowChange}
              />
            </div>
          </div>
        </Row>
      </Spin>
    </div>
  );
}

KQChamThauGia.propTypes = {
  columns: PropTypes.array,
  columns22: PropTypes.array,
  columnsDetail: PropTypes.array,
  KQChamThauGia: PropTypes.object,
};
KQChamThauGia.defaultProps = {
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
      caption: "Thứ tự",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Tính năng kỹ thuật ",
      dataField: "technical_features",
      type: 0,
      width: "15vw",
    },

    {
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
      type: 1,
      format: "Money",
      width: "6vw",
    },
    {
      caption: "Giảm giá",
      dataField: "discount_price",
      type: 0,
    },
    {
      caption: "Ưu đãi",
      dataField: "is_favour",
      type: 0,
    },

    {
      caption: "Xếp hạng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Giá nhà thầu sau thương thảo",
      dataField: "deal_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "Mời thương thảo",
      dataField: "is_deal",
      type: 1,
    },

    {
      caption: "Không đạt tiêu chí tài chính",
      dataField: "is_not_pass",
      type: 1,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass",
      type: 1,
    },
  ],
  columns22: [
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
      width: "15vw",
    },
    // {
    //   caption: "Tính năng kỹ thuật ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "15vw",
    // },
    {
      caption: "Thứ tự dự thầu",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Điểm kỹ thuật (sau quy đổi) ",
      dataField: "technical_mark_convert",
      type: 0,
      width: "",
    },
    {
      caption: "Điểm giá  (sau quy đổi)",
      dataField: "financial_mark_convert",
      type: 0,
      width: "",
    },
    {
      caption: "Điểm tổng hợp",
      dataField: "total_mark",
      type: 0,
      width: "",
    },

    {
      caption: "Giá nhà thầu",
      dataField: "bidder_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "Giảm giá",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Ưu đãi",
      dataField: "is_favour",
      type: 0,
    },
    {
      caption: "Xếp hạng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Giá nhà thầu sau thương thảo",
      dataField: "deal_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "Mời thương thảo",
      dataField: "is_deal",
      type: 1,
    },

    {
      caption: "Không đạt tiêu chí tài chính",
      dataField: "is_not_pass",
      type: 1,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass",
      type: 1,
    },
  ],
};

export default KQChamThauGia;
