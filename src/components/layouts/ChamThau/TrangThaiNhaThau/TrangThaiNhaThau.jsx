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
      openNotificationWithIcon("warning", "Vui l??ng ch???n n??m d??? th???u.");
      return;
    }
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui l??ng ch???n g??i th???u.");
      return;
    }

    setLoading(true);
    //???? n???p h??? s?? th?? m???i ???????c ????nh gi??  - show l??n t???t c??? tr??? t???o m???i
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
              label="T??n g??i th???u"
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
              T??m ki???m
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
              C???p nh???t h??? s?? h???p l???
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
      caption: "Ng?????i n???p",
      dataField: "submitter",
      type: 0,
    },
    {
      caption: "Ng??y n???p n???p",
      dataField: "submit_date",
      type: 0,
      format: "date",
    },
    {
      caption: "S??? th??? t???",
      dataField: "order",
      type: 0,
    },
    {
      caption: "S??? danh m???c d??? th???u",
      dataField: "count_details",
      type: 0,
    },

    {
      caption: "Tr???ng th??i",
      dataField: "status_name",
      type: 0,
      width: "15vw",
    },
    {
      caption: "HS h???p l???",
      dataField: "is_pass_valid",
      type: 1,
    },
    {
      caption: "HS kh??ng h???p l???",
      dataField: "is_not_pass_valid",
      type: 1,
    },
    {
      caption: "Ghi ch??",
      dataField: "note",
      type: 1,
    },
  ],
};

export default TrangThaiNhaThau;
