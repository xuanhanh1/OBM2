import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { ToolBar, DataGrid, _, callApi } from "../../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import ModalCreateAndEdit from "./ModalCreateAndEdit/ModalCreateAndEdit";
import openNotificationWithIcon from "../../../../common/notification/notification";
import DrawerChiTiet from "./DrawerChiTiet/DrawerChiTiet";

const NopHoSoThau = (props) => {
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
  const [isLoadingStatus, setLoadingStatus] = useState(false);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstBid, setLstBid] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const [isOpenDrawer, setOpenDrawer] = useState({
    isVisible: false,
    objView: {},
  });
  const handleOpenDrawer1 = (e) => {
    setOpenDrawer({
      isVisible: true,
      objView: e,
    });
  };

  useEffect(() => {
    callApi(`odata/Bids/GetByBidder`, "GET")
      .then((res) => {
        setLstBid(res.data.value);
        setObjEdit(undefined);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpenDrawer = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  const selectedRow = ([params]) => {
    const obj = _.find(lstBid, (x) => x.id === params);
    setObjEdit(obj);
  };

  const handleSearch = () => {
    setLoading(true);

    callApi(`odata/Bids/GetByBidder?$filter=status_id eq ${watch().status_id}`)
      .then((res) => {
        setLstDocument(res.data.value);
        setLoading(false);
        setObjEdit(undefined);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    setLoadingStatus(true);
    callApi(`odata/Bids/UpdateStatus?key=${isObjEdit.id}`, "PUT")
      .then((res) => {
        openNotificationWithIcon("success", "Nộp hồ sơ thành công");
        callApi(`odata/Bids/GetByBidder`, "GET")
          .then((res) => {
            setLstBid(res.data.value);
            setObjEdit(undefined);
          })
          .catch((err) => console.log(err));
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.log(err.response);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
        setLoadingStatus(false);
      });
  };

  return (
    <div>
      <ToolBar
        setEdit={() => handleOpenDrawer(1)}
        titleEdit="Cập nhật"
        data={isObjEdit}
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
            <Button
              loading={isLoadingStatus}
              type="primary"
              style={{ marginTop: 22, color: "white" }}
              onClick={handleUpdate}
              disabled={isObjEdit ? false : true}
            >
              Nộp hồ sơ dự thầu
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
          exportExcel={false}
          allowView={true}
          viewObj={handleOpenDrawer1}
        />
      </div>
      {isStatusModal.isVisible ? (
        <ModalCreateAndEdit
          isVisible={isStatusModal.isVisible}
          setVisible={setStatusModal}
          isStatus={isStatusModal.status}
          objEdit={isObjEdit}
          setObjEdit={setObjEdit}
        />
      ) : (
        <></>
      )}
      {isOpenDrawer.isVisible ? (
        <DrawerChiTiet
          isVisible={isOpenDrawer.isVisible}
          setVisible={setOpenDrawer}
          objView={isOpenDrawer.objView}
        />
      ) : null}
    </div>
  );
};

NopHoSoThau.propTypes = {
  columns: PropTypes.array,
  NopHoSoThau: PropTypes.object,
};
NopHoSoThau.defaultProps = {
  columns: [
    {
      caption: "Đơn vị mời thầu",
      dataField: "hospital_name",
      type: 0,
      width: "15vw",
    },

    {
      caption: " Hồ sơ mời thầu",
      dataField: "bidding_document_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Loại gói thầu",
      dataField: "medical_supplies_type_name",
      type: 0,
    },
    {
      caption: "Hình thức đấu thầu",
      dataField: "bidding_document_mode_name",
      type: 0,
    },
    {
      caption: "Thứ tự tham gia",
      dataField: "order",
      type: 0,
    },
    {
      caption: "Người mua hồ sơ",
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

export default NopHoSoThau;
