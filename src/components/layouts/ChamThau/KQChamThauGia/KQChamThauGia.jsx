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
        } and status_id eq C0935543-E073-41E9-9162-410614383691 and ${year}`, // ??ang ch???m th???u
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
      openNotificationWithIcon("warning", "Vui l??ng ch???n g??i th???u");
      return;
    }
    // get lst details

    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });

    // //da ket thuc thoi gian cham gia hay chua
    // setIsPrice(lstItem.is_update_price);
    // get chi ti???t
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
        openNotificationWithIcon("warning", "Vui l??ng th??? l???i");
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    const obj = _.find(lstDocument, (x) => x.id === watch().document_id);
    console.log("obj", obj);
    if (obj.status_id === "b283532f-4dac-40f7-a4dc-dcfdf71bfc96") {
      openNotificationWithIcon(
        "warning",
        "G??i th???u ???? ???????c c??ng khai, kh??ng ???????c s???a"
      );
      return;
    }
    // khi chua ket thuc thoi gian nhap gia thi k cho c???p nh???t tr??ng thau v?? ph????ng th???c ?????u th???u l?? 2 t??i 2 h??? s??
    if (
      obj.status_update_price !== "K???t th??c th???i gian nh???p gi??" &&
      obj.mode_id === "866c83e5-2edd-4f26-bfd4-0b0a4694319c"
    ) {
      openNotificationWithIcon("warning", "Ch??a ?????n th???i gian ch???m th???u");
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

        openNotificationWithIcon("success", "Duy???t h??? s?? th??nh c??ng");
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
      itemDocument.status_update_price === "K???t th??c th???i gian nh???p gi??"
    ) {
      openNotificationWithIcon("success", "???? k???t th??c th???i gian nh???p gi??");
      return;
    }

    callApi(
      `odata/BiddingDocuments/FinishUpdatePrice?key=${watch().document_id}`,
      "PUT"
    )
      .then((res) => {
        // setLoadingUpdate(false);

        openNotificationWithIcon("success", "K???t th??c qu?? tr??nh s???a gi??");
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
              label="N??m"
              name={"year"}
              placeholder="Ch???n n??m"
              errors={errors}
            />
          </Col>
          <Col span={3}>
            <Select
              control={control}
              label="Ph????ng th???c ?????u th???u"
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

          <Col span={4}>
            <Button
              loading={loadingUpdate}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdate}
              disabled={disableBtn}
            >
              C???p nh???t danh m???c tr??ng th???u
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
                K???t th??c th???i gian nh???p gi??
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
              Ch???m m???c ?????nh
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
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Th??? t???",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Nh??m TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "T??nh n??ng k??? thu???t ",
      dataField: "technical_features",
      type: 0,
      width: "15vw",
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 1,
      format: "Money",
      width: "6vw",
    },
    {
      caption: "Gi???m gi??",
      dataField: "discount_price",
      type: 0,
    },
    {
      caption: "??u ????i",
      dataField: "is_favour",
      type: 0,
    },

    {
      caption: "X???p h???ng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Gi?? nh?? th???u sau th????ng th???o",
      dataField: "deal_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "M???i th????ng th???o",
      dataField: "is_deal",
      type: 1,
    },

    {
      caption: "Kh??ng ?????t ti??u ch?? t??i ch??nh",
      dataField: "is_not_pass",
      type: 1,
    },
    {
      caption: "Tr??ng th???u",
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
      caption: "T??n nh?? th???u",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Nh??m TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "15vw",
    },
    // {
    //   caption: "T??nh n??ng k??? thu???t ",
    //   dataField: "technical_features",
    //   type: 0,
    //   width: "15vw",
    // },
    {
      caption: "Th??? t??? d??? th???u",
      dataField: "order",
      type: 0,
    },
    {
      caption: "??i???m k??? thu???t (sau quy ?????i) ",
      dataField: "technical_mark_convert",
      type: 0,
      width: "",
    },
    {
      caption: "??i???m gi??  (sau quy ?????i)",
      dataField: "financial_mark_convert",
      type: 0,
      width: "",
    },
    {
      caption: "??i???m t???ng h???p",
      dataField: "total_mark",
      type: 0,
      width: "",
    },

    {
      caption: "Gi?? nh?? th???u",
      dataField: "bidder_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "Gi???m gi??",
      dataField: "discount_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "??u ????i",
      dataField: "is_favour",
      type: 0,
    },
    {
      caption: "X???p h???ng",
      dataField: "rank",
      type: 0,
    },
    {
      caption: "Gi?? nh?? th???u sau th????ng th???o",
      dataField: "deal_price",
      type: 1,
      format: "Money",
    },
    {
      caption: "M???i th????ng th???o",
      dataField: "is_deal",
      type: 1,
    },

    {
      caption: "Kh??ng ?????t ti??u ch?? t??i ch??nh",
      dataField: "is_not_pass",
      type: 1,
    },
    {
      caption: "Tr??ng th???u",
      dataField: "is_pass",
      type: 1,
    },
  ],
};

export default KQChamThauGia;
