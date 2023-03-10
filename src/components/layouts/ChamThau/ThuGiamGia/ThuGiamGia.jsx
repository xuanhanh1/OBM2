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
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";

const { TabPane } = Tabs;

function ThuGiamGia(props) {
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
  const [tabActive, setTabActive] = useState();
  const [lstBidDocument, setLstBidDocument] = useState([]);
  const [isLoadingFavour, setLoadingFavour] = useState(false);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [lstBider, setLstBider] = useState([]);
  const [btnUpdate, setBtnUpdate] = useState(true);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  useEffect(() => {
    if (isOpenDrawer.isVisible == undefined) {
      handleSearch();
    }
  }, [isOpenDrawer.isVisible]);

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

  useEffect(() => {
    if (!_.isEmpty(watch().year)) {
      let year = FormatYear(watch().year);
      callApi(
        `odata/BiddingDocuments/Select?$Filter=year eq ${year} and status_id ne ED30E18D-72EE-4CD8-A9EC-6F7F25EFC33F and status_id ne DBF2DA25-F93A-4989-A00C-51C179F2F966`
      ).then((res) => {
        setLstDocument(res.data.value);
      });
    }
  }, [watch().year]);

  const handleSearch = () => {
    if (_.isEmpty(watch().document_id)) {
      openNotificationWithIcon("warning", "Vui l??ng ch???n g??i th???u");
      return;
    }
    setLoading(true);
    // get lst details
    let lstItem = _.find(lstBidDocument, function (i) {
      return i.id === watch().document_id;
    });

    // get chi ti???t
    setLoading(true);
    callApi(
      `odata/Bids?$filter=bidding_document_id eq ${
        watch().document_id
      } and status_id eq 8E6BBEBB-687D-451C-8AA2-1A1B6FEC989D or status_id eq F675B450-E87D-4379-93D4-00746357954B`
    )
      .then((res) => {
        setLstBider(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", "Vui l??ng th??? l???i");
        setLoading(false);
      });
  };

  const handleRowChange = (e) => {
    console.log(e);
    setBtnUpdate(false);
  };

  const handleUploadFavour = (e) => {
    let arr = [];
    lstBider.map((item) => {
      if (item.is_favour == true) {
        arr.push(item.id);
      }
    });
    setLoadingFavour(true);
    callApi(
      `odata/Bids/UpdateFavour?bidding_document_id=${watch().document_id}`,
      "PUT",
      arr
    )
      .then((res) => {
        openNotificationWithIcon("success", "C???p nh???t ??u ????i th??nh c??ng ");
        setLoadingFavour(false);
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
        setLoadingFavour(false);
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
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleSearch}
            >
              T??m ki???m
            </Button>
          </Col>
          <Col span={3}>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUploadFavour}
              disabled={btnUpdate}
              loading={isLoadingFavour}
            >
              C???p nh???t ??u ????i
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
                allowView={true}
              />
            </div>
          </div>
        </Row>
      </Spin>
      {/* </TabPane>
            <TabPane key="2" tab="Gi?? ??u ????i"></TabPane>
          </Tabs> */}

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
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );
}

ThuGiamGia.propTypes = {
  columns: PropTypes.array,
  ThuGiamGia: PropTypes.object,
};
ThuGiamGia.defaultProps = {
  columns: [
    {
      caption: "T??n g??i th???u",
      dataField: "bidding_document_name",
      type: 0,
    },
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
      caption: "Ng??y mua",
      dataField: "buy_date",
      type: 0,
      format: "date",
    },

    {
      caption: "S??? danh m???c d??? th???u",
      dataField: "count_details",
      type: 0,
    },
    {
      caption: "S??? danh m???c gi???m gi??",
      dataField: "count_discounts",
      type: 0,
    },
    // {
    //   caption: "Th?? gi???m gi??",
    //   dataField: "is_discount",
    //   type: 0,
    // },
    {
      caption: "S??? danh m???c ??u ????i",
      dataField: "count_favours",
      type: 0,
    },
    {
      caption: "??u ????i t???t c???  ",
      dataField: "is_favour",
      type: 1,
    },
    {
      caption: "Ghi ch??",
      dataField: "note",
      type: 0,
    },
    {
      caption: "Tr???ng th??i",
      dataField: "status_name",
      type: 0,
    },
  ],
};

export default ThuGiamGia;
