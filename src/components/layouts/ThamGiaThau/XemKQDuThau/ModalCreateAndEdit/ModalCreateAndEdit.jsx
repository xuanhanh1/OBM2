import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Row, Col, Tabs, Button } from "antd";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { callApi, useLocalStorage, _ } from "../../../index";
import DataGridUpdatePrice from "../../../../../common/control/dataGridUpdatePrice";
import ModalUploadExcel from "./ModalUploadExcel";
import openNotificationWithIcon from "../../../../../common/notification/notification";

const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    setObjEdit,
    columns,
    lstBidDocument,
    lstBid,
  } = props;
  console.log("lstBidDocument", lstBidDocument);
  console.log("lstBid", lstBid);
  const [isStatusModal, setStatusModal] = useState({
    isVisible: false,
    status: 0,
  });
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleOpenDrawer1 = (status) => {
    //status Create:0 Edit:1
    setStatusModal({
      isVisible: true,
      status,
    });
  };

  // useEffect(() => {
  //   if (objEdit.status_name !== "Đang chấm thầu") {
  //     setVisible(false);
  //   }
  // }, []);

  const handleCancel = () => {
    setVisible(false);
  };
  //Submit form
  const onSubmit = (data) => {
    console.log("lstBidDocument", lstBidDocument);
    lstBidDocument.map((item) => {
      item.bidder_price = item.price;
    });
    callApi(`odata/BidDetails/UpdatePrice`, "POST", lstBidDocument)
      .then((res) => {
        openNotificationWithIcon("success", "Thêm thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdatePrice = () => {};

  const selectedRow = ([params]) => {};

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("Xem kết quả dự thầu") : t("SuaNV")}
        visible={isVisible}
        width={"90vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 10 }}
        footer={[
          <button onClick={handleCancel} className="btnCancel">
            {t("Huy")}
          </button>,
          <button
            form="form"
            key="submit"
            htmlType="submit"
            className="btnSubmit"
          >
            {t("LuuThongTin")}
          </button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("Cập nhật thủ công")} key="1">
            <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[16, 0]}>
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
                      onClick={handleUpdatePrice}
                    >
                      Cập nhật giá
                    </Button>
                  </Col>
                </div>
              </Row>

              <div
                className="gridView gridViewBHXH"
                style={{ height: "calc(100vh - 400px)" }}
              >
                <DataGridUpdatePrice
                  column={columns}
                  data={lstBidDocument}
                  dataKey={"id"}
                  showFilterRow={true}
                  selectionChanged={selectedRow}
                  exportExcel={false}
                  viewObj={handleOpenDrawer1}
                  showPager={true}
                />
              </div>
            </form>
          </TabPane>
          <TabPane tab="Cập nhật bằng file Excel">
            <ModalUploadExcel
              lstBid={lstBid}
              setVisible={setVisible}
            ></ModalUploadExcel>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {
  columns: PropTypes.array,
  ModalCreateAndEdit: PropTypes.object,
};

ModalCreateAndEdit.defaultProps = {
  columns: [
    {
      caption: "Mã nhân viên",
      dataField: "code",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Tên nhân viên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Ngày sinh",
      dataField: "date_of_birth",
      type: 0,
      width: "5vw",
      format: "date",
    },
    {
      caption: "Điện thoại",
      dataField: "phone",
      type: 0,
      width: "5vw",
    },
    {
      caption: "Địa chỉ",
      dataField: "address",
      type: 0,
    },
    {
      caption: "Email",
      dataField: "email",
      type: 0,
    },
    {
      caption: "Tên khoa/phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Tên chức vụ",
      dataField: "position_name",
      type: 0,
      width: "5vw",
    },
    {
      caption: "UserName",
      dataField: "user_name",
      type: 0,
      width: "5vw",
    },
  ],
};

export default ModalCreateAndEdit;
