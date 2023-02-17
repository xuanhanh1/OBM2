import React, { useState, useEffect } from "react";
import { Button, Col, Row, Tabs, Spin } from "antd";
import { useDispatch } from "react-redux";
import { DataGrid, _, Select, callApi } from "../../index";
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

const { TabPane } = Tabs;

function DMKCoNhaThau(props) {
  const { columns, columnsDetail, documentId } = props;
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

  useEffect(() => {
    if (!_.isEmpty(documentId)) {
      setLoading(true);
      callApi(
        `odata/BiddingDocumentDetails/NotBid?$Filter=bidding_document_id eq ${documentId}`
      )
        .then((res) => {
          setLstDocument(res.data.value);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [documentId]);

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

  const handleRowChange = (e) => {};

  return (
    <div>
      <Spin spinning={isLoading}>
        <div className="gridView">
          <DataGrid
            column={columns}
            data={lstDocument}
            dataKey={"id"}
            showFilterRow={true}
            selectionChanged={selectedRow}
            exportExcel={false}
            viewObj={handleOpenDrawer1}
            handleRowChange={handleRowChange}
            showPager={true}
          />
        </div>
      </Spin>
      {/* {isPrint ? (
        <div style={{ display: "none" }}>
          <NhaThauTrungThau isPrint={isPrint} lstRecived={lstRecived} />
        </div>
      ) : null} */}
    </div>
  );
}

DMKCoNhaThau.propTypes = {
  columns: PropTypes.array,
  columnsDetail: PropTypes.array,
  columnsDetailThuoc: PropTypes.array,
  DMKCoNhaThau: PropTypes.object,
};
DMKCoNhaThau.defaultProps = {
  columns: [
    {
      caption: "Mã BV",
      dataField: "medical_supplies_code_bv",
      type: 0,
    },
    {
      caption: "Tên BYT",
      dataField: "medical_supplies_name_byt",
      type: 0,
    },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
    },
    {
      caption: "Cách đánh giá về KT",
      dataField: "technical_evaluation_type_name",
      type: 0,
    },
    {
      caption: "Tính năng KT",
      dataField: "technical_features",
      type: 0,
    },
    {
      caption: "Tiền ĐBDT",
      dataField: "bid_security_money",
      type: 0,
      format: "Money",
    },
    {
      caption: "Tỉ lệ ĐBDT",
      dataField: "bid_security_rate",
      type: 0,
    },
  ],
};

export default DMKCoNhaThau;
