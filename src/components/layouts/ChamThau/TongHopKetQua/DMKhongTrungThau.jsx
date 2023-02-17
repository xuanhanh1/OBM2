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

function DMKhongTrungThau(props) {
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
        `odata/BidDetailByHospitals/Lose?bidding_document_id=${documentId}`
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

DMKhongTrungThau.propTypes = {
  columns: PropTypes.array,
  columnsDetail: PropTypes.array,
  columnsDetailThuoc: PropTypes.array,
  DMKhongTrungThau: PropTypes.object,
};
DMKhongTrungThau.defaultProps = {
  columns: [
    {
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
      width: "25vw",
    },
    {
      caption: "Tên danh mục",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Tiêu chuẩn đánh giá kỹ thuật",
      dataField: "technical_evaluation_type_name",
      type: 0,
    },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Đơn giá dự thầu",
      dataField: "price",
      type: 0,
      format: "Money",
    },
    {
      caption: "Điểm nhà thầu",
      dataField: "bidder_technical_mark",
      type: 0,
    },
    {
      caption: "Điểm tb bệnh viện",
      dataField: "avg_technical_mark",
      type: 0,
    },
    {
      caption: "Số người đã chấm",
      dataField: "sum_marker",
      type: 0,
    },
  ],
};

export default DMKhongTrungThau;
