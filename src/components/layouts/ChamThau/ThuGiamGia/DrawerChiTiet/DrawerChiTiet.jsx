import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Row,
  Col,
  Descriptions,
  Button,
  Checkbox,
  Tabs,
  Space,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { callApi, _, DataGrid } from "../../../index";
import { createTypesDepartment } from "../../../../../redux/actions/DanhMuc";
import { t } from "i18next";
import { FormatMoney } from "../../../../controller/Format";
import openNotificationWithIcon from "../../../../../common/notification/notification";

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
  console.log("objView", objView);
  const dispatch = useDispatch();
  const [lstBidder, setLstBidder] = useState([]);
  const [lstBidder1, setLstBidder1] = useState([]);
  const [lstDetail, setLstDetail] = useState([]);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });

  const onClose = () => {
    setVisible({ isVisible: false, objView: {} });
  };

  const selectedRow = ([params]) => {};

  useEffect(() => {
    callApi(
      `odata/BidDetails/GetByBid?bid_id=${objView.id}&$Filter=is_technical eq true`
    ).then((res) => {
      setLstDetail(res.data.value);
    });
  }, []);

  const handleUpdate = () => {
    console.log("objView.details", objView.details);
    let dataSend = lstDetail.map((item) => {
      return {
        ...item,
        bid_detail_id: item.id,
      };
    });
    callApi(`odata/BidDetails/UpdateDiscount`, "PUT", dataSend)
      .then((res) => {
        console.log(res.data.value);
        openNotificationWithIcon(
          "success",
          "Cập nhật thư giảm giá thành công "
        );
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("warning", err.response.data.errors[0]);
      });
  };
  const handleRowChange = () => {};

  return (
    <>
      <Drawer
        title={`Thông tin chi tiết gói thầu`}
        placement="right"
        width={"80vw"}
        onClose={onClose}
        visible={isVisible}
        maskClosable={false}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Danh sách vật tư" key="1">
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
                    type="primary"
                    style={{ marginTop: 22, color: "white" }}
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </Button>
                </Col>
              </div>
            </Row>
            <div className="gridView" style={{ height: "calc(100vh - 125px)" }}>
              <DataGrid
                column={columns}
                data={lstDetail}
                showPager={true}
                dataKey={"id"}
                showFilterRow={true}
                selectionChanged={selectedRow}
                handleRowChange={handleRowChange}
              />
            </div>
          </TabPane>
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
      caption: "Tên danh mục",
      dataField: "bidding_document_detail_name",
      type: 0,
    },
    {
      caption: "Tên hoạt chất",
      dataField: "ingredient_name",
      type: 0,
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
    },
    {
      caption: "Đơn vị tính",
      dataField: "unit",
      type: 0,
    },
    {
      caption: "Đường dùng",
      dataField: "usage",
      type: 0,
    },
    {
      caption: "Dạng bào chế",
      dataField: "model",
      type: 0,
    },
    {
      caption: "Nồng độ/hàm lượng",
      dataField: "dosage",
      type: 0,
    },

    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
      width: "5vw",
      format: "Money",
    },

    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Đơn giá công khai",
      dataField: "public_price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Đơn giá nhà thầu",
      dataField: "price",
      type: 0,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Giá nhà thầu sau thư GG",
      dataField: "discount_price",
      type: 1,
      format: "Money",
      width: "5vw",
    },
    {
      caption: "Ưu đãi",
      dataField: "is_favour",
      type: 1,
    },
  ],
};

export default DrawerChiTiet;
