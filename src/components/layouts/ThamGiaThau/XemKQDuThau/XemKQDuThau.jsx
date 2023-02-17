import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Row, Spin } from "antd";
import { useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi, moment } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

import openNotificationWithIcon from "../../../../common/notification/notification";

import YearPickerField from "../../../../common/control/componentsForm/YearPicker";

import { FormatYear } from "../../../controller/Format";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";

function XemKQDuThau(props) {
  const { columns, columnsThuoc } = props;
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
  const [lstDocument, setLstDocument] = useState([]);
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const dataFetchedRef = useRef(false);
  const [lstBid, setLstBid] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [type, setType] = useState();
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
    if (isStatusModal.isVisible == undefined) {
      handleSearch();
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
    const obj = _.find([], (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleDelete = (params) => {};

  useEffect(() => {
    if (!_.isEmpty(watch().year)) {
      let year = FormatYear(watch().year);
      let mode = watch().mode_id ? ` and mode_id eq ${watch().mode_id}` : "";
      let type = watch().type_id ? ` and type_id eq ${watch().type_id}` : "";
      callApi(
        `odata/BiddingDocuments/Select?$filter=year eq ${year} ${mode} ${type}`
      ).then((res) => {
        setLstDocument(res.data.value);
      });
    }
  }, [watch().year, watch().mode_id, watch().type_id]);

  const handleSearch = () => {
    setDisableBtn(true);
    if (_.isEmpty(watch().year)) {
      openNotificationWithIcon("warning", "Vui lòng chọn năm dự thầu.");
      return;
    }
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu.");
      return;
    }
    if (_.isEmpty(watch().type_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn loại gói thầu.");
      return;
    }
    if (_.isEmpty(watch().mode_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn phương thức.");
      return;
    }

    let item = _.find(lstDocument, (item) => item.id === watch().document_id);

    setType(item.type_name);

    if (watch().type_id === "be7be5ea-a37c-430b-9ac4-ae2700200555") {
      // thuoc
      setLoading(true);
      callApi(
        `odata/BidDetailThuocs/GetByBidder?bidding_document_id=${
          watch().document_id
        }`
      )
        .then((res) => {
          setLstBidDocument(res.data);
          console.log("res.data", res.data);
          let a = _.filter(res.data, function (i) {
            return i.status_name === "Đang xét tiêu chí giá";
          });
          console.log("a", a);
          setLoading(false);
          setObjEdit(undefined);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      callApi(
        `odata/Bids/GetByBidder?$filter=bidding_document_id eq ${
          watch().document_id
        }`,
        "GET"
      )
        .then((res) => {
          setLstBid(res.data.value);
          setObjEdit(undefined);
        })
        .catch((err) => console.log(err));
    } else if (watch().type_id === "ad8a1f68-2542-4713-9dd8-ae2700201123") {
      //vat tu
      setLoading(true);
      callApi(
        `odata/BidDetailByHospitals/GetAll?bidding_document_id=${
          watch().document_id
        }`
      )
        .then((res) => {
          setLstBidDocument(res.data.value);
          console.log("res.data", res.data.value);
          let a = _.filter(res.data, function (i) {
            return i.status_name === "Đang xét tiêu chí giá";
          });
          console.log("a", a);
          setLoading(false);
          setObjEdit(undefined);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      callApi(
        `odata/Bids/GetByBidder?$filter=bidding_document_id eq ${
          watch().document_id
        }`,
        "GET"
      )
        .then((res) => {
          setLstBid(res.data.value);
          setObjEdit(undefined);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUpdatePrice = () => {
    handleOpenDrawer(0);
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
              label="Loại gói thầu"
              name={"type_id"}
              arrayItem={`odata/MedicalSuppliesTypes`}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
              required
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
              label="Tên gói thầu"
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
              loading={isLoading}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdatePrice}
              disabled={!disableBtn}
            >
              Cập nhật giá
            </Button>
          </Col>
        </div>
      </Row>
      <Spin spinning={isLoading}>
        <div className="gridView">
          <DataGrid
            column={type === "Thuốc" ? columnsThuoc : columns}
            data={lstBidDocument}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
            exportExcel={false}
            viewObj={handleOpenDrawer1}
            showPager={true}
          />
        </div>{" "}
      </Spin>

      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          lstBidDocument={_.filter(lstBidDocument, function (i) {
            return i.status_name === "Đang xét tiêu chí giá";
          })}
          lstBid={lstBid}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

XemKQDuThau.propTypes = {
  columns: PropTypes.array,
  columnsThuoc: PropTypes.array,
  XemKQDuThau: PropTypes.object,
};
XemKQDuThau.defaultProps = {
  columns: [
    {
      caption: "Tên danh mục",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      format: "Money",
    },
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
      dataField: "price",
      type: 0,
      format: "Money",
    },

    {
      caption: "Điểm bệnh viện chấm",
      dataField: "technical_mark",
      type: 0,
    },

    {
      caption: "Số người chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 1.1",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 1.2",
      dataField: "d12_bv",
      type: 0,
    },

    {
      caption: "Tiêu chuẩn 2",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 3",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 4",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 5",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 6",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 7",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 8",
      dataField: "d8_bv",
      type: 0,
    },

    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],
  columnsThuoc: [
    {
      caption: "Tên danh mục",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      format: "Money",
    },
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
      dataField: "price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Điểm bệnh viện chấm",
      dataField: "hospital_technical_mark",
      type: 0,
    },

    {
      caption: "Số người chấm",
      dataField: "sum_marker",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 1",
      dataField: "d1_bv",
      type: 0,
    },

    {
      caption: "Tiêu chuẩn 2",
      dataField: "d2_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 3",
      dataField: "d3_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 4",
      dataField: "d4_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 5",
      dataField: "d5_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 6",
      dataField: "d6_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 7",
      dataField: "d7_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 8",
      dataField: "d8_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 10",
      dataField: "d10_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 11",
      dataField: "d11_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 12",
      dataField: "d12_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 13",
      dataField: "d13_bv",
      type: 0,
    },
    {
      caption: "Tiêu chuẩn 14",
      dataField: "d14_bv",
      type: 0,
    },

    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
    },
    {
      caption: "Trúng thầu",
      dataField: "is_pass_financial",
      type: 0,
    },
  ],
};

export default XemKQDuThau;
