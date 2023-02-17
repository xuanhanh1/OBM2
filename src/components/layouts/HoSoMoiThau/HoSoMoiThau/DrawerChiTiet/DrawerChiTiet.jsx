import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer, Tabs, Spin } from "antd";
import { useDispatch } from "react-redux";
import { callApi, _, DataGrid } from "../../../index";

import { t } from "i18next";

const { TabPane } = Tabs;
function DrawerChiTiet(props) {
  const {
    isVisible,
    setVisible,
    objView,
    columns,
    columnsBidder,
    isPHHS = false,
  } = props;

  const dispatch = useDispatch();
  const [lstBidder, setLstBidder] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [lstBidder1, setLstBidder1] = useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

  useEffect(() => {
    console.log("objView", objView);
    //get chi tiet
    setLoading(true);
    callApi(
      `odata/BiddingDocumentDetails?$Filter=bidding_document_id eq ${objView.id}`
    )
      .then((res) => {
        setLstDetail(res.data.value);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    //danh sach hồ sư thầu đã nộp
    callApi(
      `odata/Bids?$filter=bidding_document_id eq ${objView.id} and status_id ne CB3DD58B-BF80-422F-B0DE-4C8CEEE478EC`
    ).then((res) => {
      setLstBidder(res.data.value);
    });
    //danh scahs đã nộp và chưa nộp
    callApi(`odata/Bids?$filter=bidding_document_id eq ${objView.id}`).then(
      (res) => {
        setLstBidder1(res.data.value);
      }
    );
  }, []);

  const selectedRow = ([params]) => {};

  return (
    <>
      <Drawer
        title={`Thông tin chi tiết gói thầu
        
        `}
        placement="right"
        width={"80vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Danh sách vật tư" key="1">
            <Spin spinning={isLoading}>
              <div
                className="gridView"
                style={{ height: "calc(100vh - 125px)" }}
              >
                <DataGrid
                  column={columns}
                  data={lstDetail}
                  showPager={true}
                  dataKey={"id"}
                  showFilterRow={true}
                  selectionChanged={selectedRow}
                />
              </div>
            </Spin>
          </TabPane>
          <TabPane tab="Danh sách nhà thầu tham gia thầu" key="2">
            <div className="gridView" style={{ height: "calc(100vh - 125px)" }}>
              <DataGrid
                column={columnsBidder}
                data={lstBidder1}
                showPager={true}
                dataKey={"id"}
                showFilterRow={true}
                selectionChanged={selectedRow}
              />
            </div>
          </TabPane>
          {!isPHHS && (
            <TabPane tab="Danh sách nhà thầu nộp hồ sơ thầu" key="3">
              <div
                className="gridView"
                style={{ height: "calc(100vh - 125px)" }}
              >
                <DataGrid
                  column={columnsBidder}
                  data={lstBidder}
                  showPager={true}
                  dataKey={"id"}
                  showFilterRow={true}
                  selectionChanged={selectedRow}
                />
              </div>
            </TabPane>
          )}
        </Tabs>
      </Drawer>
    </>
  );
}

DrawerChiTiet.defaultProps = {
  columns: PropTypes.array,
  columnsBidder: PropTypes.array,
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
      caption: "Tiêu chí đánh giá kĩ thuật",
      dataField: "technical_evaluation_type_name",
      type: 0,
      width: "7vw",
    },
    {
    caption: "Nhóm TCKT",
    dataField: "technical_criteria_group_name",
    type: 0,
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
  columnsBidder: [
    {
      caption: "Tên nhà thầu",
      dataField: "bidder_name",
      type: 0,
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
      caption: "Hồ sơ hợp lệ",
      dataField: "is_pass_valid",
      type: 0,
    },
    {
      caption: "Hồ sơ không hợp lệ",
      dataField: "is_not_pass_valid",
      type: 0,
    },
  ],
};

export default DrawerChiTiet;
