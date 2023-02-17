import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import openNotificationWithIcon from "../../../../common/notification/notification";

import YearPickerField from "../../../../common/control/componentsForm/YearPicker";

import { FormatYear } from "../../../controller/Format";

function TrangThaiNhaThau(props) {
  const { columns } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dataFetchedRef = useRef(false);
  const [isObjEdit, setObjEdit] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

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
    let today = moment(new Date(), "YYYY");
    setValue("year", today);
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    // dataFetchedRef.current = true;
    if (!_.isEmpty(watch().year)) {
      let year = FormatYear(watch().year);
      callApi(`odata/BiddingDocuments/Select?$filter=year eq ${year}`).then(
        (res) => {
          setLstDocument(res.data.value);
        }
      );
    }
  }, [watch().year]);

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

    setLoading(true);
    //đã nộp hồ sơ thì mới được đánh giá  - show lên tất cả trừ tạo mới
    callApi(
      `odata/Bids?$filter=bidding_document_id eq ${
        watch().document_id
      } and status_id ne CB3DD58B-BF80-422F-B0DE-4C8CEEE478EC`
    )
      .then((res) => {
        _.orderBy(res.data.value, ["update_date"], ["asc"]);

        setLstBidDocument(res.data.value);
        setLoading(false);
        setObjEdit(undefined);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data[0].errors);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoadingUpdate(true);
    let newData = lstBidDocument.map((item) => {
      return {
        ...item,
        bid_id: item.id,
      };
    });
    callApi(`odata/Bids/UpdateValid`, "PUT", newData)
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
              loading={loadingUpdate}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdate}
              disabled={disableBtn}
            >
              Cập nhật hồ sơ hợp lệ
            </Button>
          </Col>
        </div>
      </Row>
      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstBidDocument}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          exportExcel={false}
          viewObj={handleOpenDrawer1}
          handleRowChange={handleRowChange}
        />
      </div>
    </div>
  );
}

TrangThaiNhaThau.propTypes = {
  columns: PropTypes.array,
  TrangThaiNhaThau: PropTypes.object,
};
TrangThaiNhaThau.defaultProps = {
  columns: [
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
      caption: "Người nộp",
      dataField: "submitter",
      type: 0,
    },
    {
      caption: "Ngày nộp nộp",
      dataField: "submit_date",
      type: 0,
      format: "date",
    },
    {
      caption: "Số thứ tự",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Số danh mục dự thầu",
      dataField: "count_details",
      type: 0,
    },

    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "HS hợp lệ",
      dataField: "is_pass_valid",
      type: 1,
    },
    {
      caption: "HS không hợp lệ",
      dataField: "is_not_pass_valid",
      type: 1,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 1,
    },
  ],
};

export default TrangThaiNhaThau;
