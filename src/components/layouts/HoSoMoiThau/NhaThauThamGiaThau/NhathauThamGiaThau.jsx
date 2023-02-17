import React, { useState, useEffect } from "react";
import { PageHeader, Col, Button, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi, Select } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getAllRoles } from "../../../../redux/actions/QuanTri";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import { useForm } from "react-hook-form";
import {
  SearchOutlined,
  PrinterOutlined, //
} from "@ant-design/icons";
import YearPickerField from "../../../../common/control/componentsForm/YearPicker";
import openNotificationWithIcon from "../../../../common/notification/notification";
import DSHoSoMoiThau from "../../BaoCao/DSHoSoMoiThau/DSHoSoMoiThau";
// import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";
function NhaThauThamGiaThau(props) {
  const { columns } = props;
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [lstTeam, setLstTeam] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [lstBid, setLstBid] = useState([]);
  const [isObjEdit, setObjEdit] = useState({});
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [isLoadingStatus, setLoadingStatus] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstRecived, setLstRecived] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });

  // useEffect(() => {
  //   // callApi(`odata/Statuss/BiddingDocument`, "GET").then((res) => {
  //   //   setLstBid(res.data.value);
  //   // });
  //   callApi(`odata/BiddingDocuments`, "GET").then((res) => {
  //     setLstDocument(res.data.value);
  //   });
  // }, []);

  useEffect(() => {
    if (!_.isEmpty(watch().document_id)) {
      setLoading(true);
      callApi(`odata/Bids`, "GET")
        .then((res) => {
          let arr = [];
          res.data.value.forEach((item) => {
            if (item.bidding_document_id === watch().document_id) {
              arr.push(item);
            }
          });
          setLoading(false);
          setLstBid(arr);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [watch().document_id]);

  useEffect(() => {
    if (isStatusModal.isVisible == undefined) {
      handleSearch();
    }
  }, [isStatusModal.isVisible]);

  const handleOpenDrawer = (status) => {
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

  //Chọn Row Datagrid
  const selectedRow = ([params]) => {
    const obj = _.find(lstBid, (x) => x.id === params);
    console.log("obj", obj);
    setObjEdit(obj);
  };

  const handleSearch = () => {
    setLoading(true);
    callApi(`odata/Bids`, "GET")
      .then((res) => {
        let arr = [];
        res.data.value.forEach((item) => {
          if (item.bidding_document_id === watch().document_id) {
            arr.push(item);
          }
        });
        setLoading(false);
        console.log("arr", arr);
        setLstBid(arr);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    let item = _.find(lstDocument, function (i) {
      return i.id === watch().document_id;
    });
    console.log("item", item);
    if (item.status_id === "c0935543-e073-41e9-9162-410614383691") {
      openNotificationWithIcon("warning", "Hồ sơ đang chấm thầu");
      return;
    }
    setLoadingStatus(true);
    callApi(
      `odata/BiddingDocuments/UpdateStatus?key=${watch().document_id}`,
      "PUT"
    )
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hồ sơ đã chuyển sang trạng thái chấm thầu"
        );
        handleSearch();
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.log(err.response);
        openNotificationWithIcon("warning", err.response?.data.errors[0]);
        setLoadingStatus(false);
      });
  };

  const handlePrint = (e) => {
    setLstRecived(isObjEdit);
    setIsPrint(true);
    setTimeout(() => {
      setIsPrint(false);
      setLstRecived({});
    }, 1000);
  };

  return (
    <div>
      <ToolBar
        setStateOpen={() => handleOpenDrawer(0)}
        data={isObjEdit}
        titleAdd="Cập nhật nhà thầu mua hồ sơ thầu"
      />

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
              label="Tên gói thầu"
              name={"document_id"}
              arrayItem={`odata/BiddingDocuments/Select?$filter=status_id eq dbf2da25-f93a-4989-a00c-51c179f2f966`}
              valueOpt="id"
              nameOpt="name"
              errors={errors}
            />
          </Col>
          {/* <Col span={3}>
            <YearPickerField
              control={control}
              label="Năm"
              name={"year"}
              placeholder="Chọn năm"
              errors={errors}
            />
          </Col> */}

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
              icon={<PrinterOutlined />}
              loading={loadingPrint}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handlePrint}
              disabled={!_.isEmpty(isObjEdit) ? false : true}
            >
              In
            </Button>
          </Col>
        </div>
      </Row>

      <div className="gridView">
        <DataGrid
          column={columns}
          data={lstBid}
          dataKey={"id"}
          showFilterRow={true}
          selectionChanged={selectedRow}
          viewObj={handleOpenDrawer1}
          exportExcel={false}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
          id={watch().document_id}
          lstBid={lstBid}
        />
      ) : (
        <></>
      )}

      {isPrint ? (
        <div style={{ display: "none" }}>
          <DSHoSoMoiThau isPrint={isPrint} lstRecived={lstRecived} />
        </div>
      ) : null}
    </div>
  );
}

NhaThauThamGiaThau.propTypes = {
  columns: PropTypes.array,
  ITrangThietBis: PropTypes.object,
};
NhaThauThamGiaThau.defaultProps = {
  columns: [
    {
      caption: "Tên gói thầu",
      dataField: "bidding_document_name",
      type: 0,
    },
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
      caption: "Ghi chú",
      dataField: "note",
      type: 0,
    },
    {
      caption: "Trạng thái",
      dataField: "status_name",
      type: 0,
    },
  ],
};

export default NhaThauThamGiaThau;
