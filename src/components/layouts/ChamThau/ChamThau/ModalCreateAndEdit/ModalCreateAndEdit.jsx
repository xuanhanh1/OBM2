import {
  Button,
  Col,
  Divider,
  Modal,
  Row,
  Tabs,
  Descriptions,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  FormatMoney,
  FormatYear,
  setValueReactFormHook,
} from "../../../../controller/Format";

import {
  Input,
  Notification,
  _,
  callApi,
  TextArea,
  Select,
  DataGrid,
  DataGridTCKT,
} from "../../../index";

import DatePicker from "../../../../../common/control/componentsForm/DatePicker";
import PropTypes from "prop-types";
import openNotificationWithIcon from "../../../../../common/notification/notification";

const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
    id,
    setObjEdit,
    columns,
    columnsChoice,
  } = props;

  const [isResult, setResult] = useState(null);
  //Các danh sách select option
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [disableOne, setDisableOne] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [lstPickTCKT, setLstPickTCKT] = useState([]);
  const [isRender, setIsRender] = useState(true);
  const [lstTechnicalEvaluationTypes, setLstTechnicalEvaluationTypes] =
    useState([]);
  const [lstChoiceTCKT, setLstChoiceTCKT] = useState([]);

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
      callApi(
        `odata/TechnicalEvaluationDetails/GetToEdit?bid_detail_id=${objEdit.id}`,
        "GET"
      ).then((res) => {
        let lstSelected = [];
        res.data.value.map((item) => {
          if (item.is_select == true) {
            lstSelected.push(item);
          }
        });
        console.log("res.data.value", res.data.value);
        setLstPickTCKT(lstSelected);
        setLstTechnicalEvaluationTypes(res.data.value);
      });
    } else {
      callApi(`odata/TechnicalEvaluationTypes?$Expand=details`, "GET").then(
        (res) => {
          console.log("res.data.value[0].details", res.data.value[0].details);
          setLstTechnicalEvaluationTypes(res.data.value[0].details);
        }
      );
    }
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRowTCKT = (params) => {
    console.log("selectedRowTCKT");
    let count = 0;
    for (let i = 0; i < params.length; i++) {
      for (let j = i + 1; j < params.length; j++) {
        if (params[i].cha === params[j].cha) {
          count++;
        }
      }
    }
    if (count > 0) {
      openNotificationWithIcon(
        "warning",
        "Chỉ được chọn 1 tiêu chuẩn kỹ thuật"
      );
      setLstChoiceTCKT([]);
    } else {
      setLstChoiceTCKT(params);
    }
  };

  //Submit form
  const onSubmit = async (data) => {
    let lstSelected = [];
    lstTechnicalEvaluationTypes.map((item) => {
      if (item.is_select == true) {
        lstSelected.push(item.id);
      }
    });

    if (lstSelected && lstSelected.length == 0) {
      openNotificationWithIcon("warning", "Vui lòng chọn tiêu chuẩn kỹ thuât");
      return;
    }

    let dataSend = [
      {
        ...data,
        bid_detail_id: objEdit.id,
        list_marks: lstSelected,
      },
    ];
    if (isStatus === 1) {
      //Thêm mới
      callApi(`odata/BidEvaluations`, "POST", dataSend)
        .then((res) => {
          openNotificationWithIcon("success", "Chấm thầu thành công");
          setVisible(true);
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        });
    } else {
      //Sửa
    }
  };

  const handleRowChange = (e) => {
    let pickKey = e[0].key;

    if (e[0].data.is_select == true) {
      //get in type tckt
      let item = _.find(lstTechnicalEvaluationTypes, function (i) {
        return i.id === pickKey;
      });

      if (lstPickTCKT.length > 0) {
        lstPickTCKT.forEach((i) => {
          if (i.cha === item.cha && i.id !== item.id) {
            lstTechnicalEvaluationTypes.map((item) => {
              if (item.id === pickKey) {
                return (item.is_select = false);
              }
            });
            openNotificationWithIcon(
              "warning",
              "Chỉ được chọn 1 tiêu chí kỹ thuật, vui lòng chọn lại"
            );

            setIsRender(!isRender);
          } else {
            if (item.is_select) {
              setLstPickTCKT([item, ...lstPickTCKT]);
            }
          }
        });
      } else {
        console.log("them vào");
      }
    } else {
      lstTechnicalEvaluationTypes.map((item) => {
        if (item.id === pickKey) {
          return (item.is_select = false);
        }
      });
      _.remove(lstPickTCKT, function (i) {
        return i.is_select == false;
      });
    }
  };

  return (
    <div>
      <Modal
        title={
          isStatus === 0 ? t("Thêm hồ sơ dự thầu") : t("Sửa hồ sơ dự thầu")
        }
        visible={isVisible}
        width={"90vw"}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: 20 }}
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
        <form className="form" id="form" onSubmit={handleSubmit(onSubmit)}>
          <Col span={24}>
            <Space size={24}>
              <Descriptions
                bordered
                size="small"
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                  marginLeft: "30px",
                  justifyContent: "center",
                }}
              >
                <Descriptions.Item label={"Tên nhà thầu"} span={3}>
                  <b>{objEdit.bidder_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Tên trên bao bì"} span={1}>
                  <b>{objEdit.packing_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Số lượng"} span={1}>
                  <b>{objEdit.quantity}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Đơn giá"} span={1}>
                  <b>{FormatMoney(objEdit.price)}</b>
                </Descriptions.Item>

                <Descriptions.Item label={"Đơn giá kê khai"} span={1}>
                  <b>{FormatMoney(objEdit.public_price)}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Quy cách"} span={1}>
                  <b>{objEdit.specification}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Hạn dùng (Tháng)"} span={1}>
                  <b>{objEdit.expiry}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nhà sản xuất"} span={1}>
                  <b>{objEdit.producer}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Xuất xứ"} span={1}>
                  <b>{objEdit.origin}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"GPLHSP hoặc GPNK"} span={1}>
                  <b>{objEdit.license}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Nhóm TCKT"} span={1}>
                  <b>{objEdit.technical_criteria_group_name}</b>
                </Descriptions.Item>
                <Descriptions.Item label={"Điểm nhà thầu chấm"} span={1}>
                  <b>{objEdit.bidder_technical_mark}</b>
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Col>
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <TextArea
                control={control}
                label="Ghi chú"
                name={register("note")}
              />
            </Col>
          </Row>
          <Col span={24} style={{ paddingTop: "25px" }}>
            <div className="gridView" style={{ height: "calc(100vh - 400px)" }}>
              <DataGridTCKT
                data={lstTechnicalEvaluationTypes}
                dataKey={"id"}
                showFilterRow={true}
                selectionChanged={selectedRowTCKT}
                exportExcel={false}
                handleRowChange={handleRowChange}
              />
            </div>
          </Col>
        </form>
      </Modal>
    </div>
  );
}

ModalCreateAndEdit.propTypes = {
  columns: PropTypes.array,
  columnsChoice: PropTypes.array,
  ModalCreateAndEdit: PropTypes.object,
};
ModalCreateAndEdit.defaultProps = {
  columns: [],
  columnsChoice: [],
};

export default ModalCreateAndEdit;
