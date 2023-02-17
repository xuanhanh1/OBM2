import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer, Tabs, Spin } from "antd";
import { useDispatch } from "react-redux";
import { callApi, _ } from "../../../index";

import { t } from "i18next";

import DataGridTCKTExcel from "../../../../../common/control/dataGridTCKTExcel";

const { TabPane } = Tabs;
function DrawerChiTiet(props) {
  const { isVisible, setVisible, objView, columns, columnsThuoc } = props;
  console.log("objView", objView);
  const dispatch = useDispatch();

  const [lstBidDetail, setLstBidDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

  const selectedRow = ([params]) => {};

  useEffect(() => {
    //get chi tiết gói thầu vừa chấm CTKT
    setLoading(true);
    callApi(`odata/BidDetailByBids?bid_id=${objView.id}`, "GET").then((res) => {
      setLstBidDetail(res.data.value);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Drawer
        title={`Thông tin chi tiết hồ sơ dự thầu `}
        placement="right"
        width={"95vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <div
            className="gridView gridViewBHXH"
            style={{ height: "calc(100vh - 125px)" }}
          >
            <DataGridTCKTExcel
              data={lstBidDetail}
              showPager={true}
              dataKey={"id"}
              showFilterRow={true}
              selectionChanged={selectedRow}
              typeId={objView.medical_supplies_type_id}
              modalId={objView.bidding_document_mode_id}
              showMarkSymbol={true}
              //  showPager={true}
            />
          </div>
        </Spin>
      </Drawer>
    </>
  );
}

DrawerChiTiet.defaultProps = {
  columns: PropTypes.array,
  columnsThuoc: PropTypes.array,
};
DrawerChiTiet.defaultProps = {
  columns: [
    {
      caption: "Mã thuốc vật tư",
      dataField: "medical_supplies_code_byt",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Nhóm tiêu chí đánh giá",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "10vw",
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
    {
      caption: "Tiêu chí 1.1",
      dataField: "tc11",
      type: 0,
    },
    {
      caption: "Tiêu chí 1.2",
      dataField: "tc12",
      type: 0,
    },
    {
      caption: "Tiêu chí 2",
      dataField: "tc2",
      type: 0,
    },
    {
      caption: "Tiêu chí 3",
      dataField: "tc3",
      type: 0,
    },
    {
      caption: "Tiêu chí 4",
      dataField: "tc4",
      type: 0,
    },
    {
      caption: "Tiêu chí 5",
      dataField: "tc5",
      type: 0,
    },
    {
      caption: "Tiêu chí 6",
      dataField: "tc6",
      type: 0,
    },
    {
      caption: "Tiêu chí 7",
      dataField: "tc7",
      type: 0,
    },
    {
      caption: "Tiêu chí 8",
      dataField: "tc8",
      type: 0,
    },
  ],
  columnsThuoc: [
    {
      caption: "Mã thuốc vật tư",
      dataField: "medical_supplies_code_byt",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Nhóm tiêu chí đánh giá",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "10vw",
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
    {
      caption: "Tiêu chí 1",
      dataField: "tc1",
      type: 0,
    },

    {
      caption: "Tiêu chí 2",
      dataField: "tc2",
      type: 0,
    },
    {
      caption: "Tiêu chí 3",
      dataField: "tc3",
      type: 0,
    },
    {
      caption: "Tiêu chí 4",
      dataField: "tc4",
      type: 0,
    },
    {
      caption: "Tiêu chí 5",
      dataField: "tc5",
      type: 0,
    },
    {
      caption: "Tiêu chí 6",
      dataField: "tc6",
      type: 0,
    },
    {
      caption: "Tiêu chí 7",
      dataField: "tc7",
      type: 0,
    },
    {
      caption: "Tiêu chí 8",
      dataField: "tc8",
      type: 0,
    },
    {
      caption: "Tiêu chí 10",
      dataField: "tc10",
      type: 0,
    },
    {
      caption: "Tiêu chí 11",
      dataField: "tc11",
      type: 0,
    },
    {
      caption: "Tiêu chí 12",
      dataField: "tc12",
      type: 0,
    },
    {
      caption: "Tiêu chí 13",
      dataField: "tc13",
      type: 0,
    },
    {
      caption: "Tiêu chí 14",
      dataField: "tc14",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
