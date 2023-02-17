import React, { useState, useEffect } from "react";
import { Button, Col, Row, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

import openNotificationWithIcon from "../../../../common/notification/notification";

import { getAllBidDocument } from "../../../../redux/actions/GoiThau";

function DanhMucThau(props) {
  const { columns } = props;
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

  const [lstDetails, setLstDetail] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    dispatch(getAllBidDocument());
  }, []);

  useEffect(() => {
    if (!_.isEmpty(watch().type_id)) {
      callApi(
        `odata/BiddingDocuments/Select?$filter=type_id eq ${watch().type_id}`,
        "GET"
      ).then((res) => {
        setLstDocument(res.data.value);
      });
    }
  }, [watch().type_id]);

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

  const selectedRow = ([params]) => {};

  const handleDelete = (params) => {};

  const handleSearch = () => {
    if (_.isEmpty(watch().type_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn loại gói thầu");
      return;
    }
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui lòng chọn gói thầu");
      return;
    }
    let lstDocumentDetail = _.find(lstDocument, function (i) {
      return i.id === watch().document_id;
    });
    setLoading(true);
    callApi(
      `odata/BiddingDocumentDetails/GetByBiddingDocument?bidding_document_id=${
        watch().document_id
      }`
    )
      .then((res) => {
        setLstDetail(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
              label="Loại gói thầu"
              name={"type_id"}
              arrayItem={`odata/MedicalSuppliestypes`}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
            />
          </Col>

          <Col span={6}>
            <Select
              control={control}
              label="Danh sách các gói thầu"
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
        </div>
      </Row>
      <Spin spinning={isLoading}>
        <div className="gridView">
          <DataGrid
            column={columns}
            data={lstDetails}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
            exportExcel={true}
            viewObj={handleOpenDrawer1}
            showPager={true}
          />
        </div>
      </Spin>
    </div>
  );
}

DanhMucThau.propTypes = {
  columns: PropTypes.array,
  DanhMucThau: PropTypes.object,
};
DanhMucThau.defaultProps = {
  columns: [
    {
      caption: "Mã danh mục",
      dataField: "medical_supplies_code_byt",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Nhóm tiêu chí đánh giá",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "7vw",
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
      width: "7vw",
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      format: "number",
    },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tỉ lệ đảm bảo dự thầu",
      dataField: "bid_security_rate",
      type: 0,
      format: "number",
    },
    {
      caption: "Tiền đảm bảo dự thầu",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tính năng kỹ thuật",
      dataField: "technical_features",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
  ],
};

export default DanhMucThau;
