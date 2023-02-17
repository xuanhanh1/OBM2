import { Col, Modal, Row, Tabs, Spin, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import "./index.css";
import { setValueReactFormHook } from "../../../../controller/Format";

import {
  Input,
  _,
  callApi,
  Select,
  DataGrid,
  DataGridTCKT,
} from "../../../index";

import PropTypes from "prop-types";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import DataGridTCKTExcel from "../../../../../common/control/dataGridTCKTExcel";
import ModalImportExcel from "./ModalImportExcel";

const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, columns } =
    props;

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
  const [lstChoice, setLstChoice] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [lstDocumentDetail, setLstDocumentDetail] = useState([]);
  const [lstTechnicalEvaluationTypes, setLstTechnicalEvaluationTypes] =
    useState([]);
  const [lstChoiceTCKT, setLstChoiceTCKT] = useState([]);
  const [tabActive, setTabActive] = useState(0);
  const [loadingChangeTab, setLoadingChangeTab] = useState(false);
  const [lstPickTCKT, setLstPickTCKT] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [lstParmas, setLstParmas] = useState([]);
  const [typeId, setTypeId] = useState();
  const [modalId, setModalId] = useState();
  const [lstPickExcel, setLstPickExcel] = useState([]);
  const [disables, setDisable] = useState(false);

  useEffect(() => {
    if (isStatus === 1) {
      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
      //trạng thái đã nộp hồ sơ
      if (objEdit.status_id !== "cb3dd58b-bf80-422f-b0de-4c8ceee478ec") {
        openNotificationWithIcon("warning", "Hồ sơ đã nộp, không được sửa");
        setVisible(false);
      }
    }
  }, []);

  useEffect(() => {
    let idType;
    setLoading(true);
    if (!_.isEmpty(objEdit)) {
      //get goi thau
      callApi(
        `odata/BiddingDocuments?$filter=id eq ${objEdit.bidding_document_id}`,
        "GET"
      )
        .then((res) => {
          //get detail gois thaauf
          callApi(
            `odata/BiddingDocumentDetails?$Filter=bidding_document_id eq ${objEdit.bidding_document_id}`,
            "GET"
          ).then((res) => {
            setLstDocument(res.data.value);
          });
          setTypeId(res.data.value[0].type_id);
          setModalId(res.data.value[0].mode_id);
          idType = res.data.value[0].type_id;

          setLoading(false);
          callApi(
            `odata/TechnicalEvaluationTypes?$Expand=details&$filter=medical_supplies_type_id eq ${res.data.value[0].type_id}`,
            "GET"
          ).then((res) => {
            setLstTechnicalEvaluationTypes(res.data.value[0].details);
          });
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false);
        });
    }
  }, [objEdit]);

  useEffect(() => {
    if (!_.isEmpty(lstChoice)) {
      setLstPickExcel(lstChoice);
      callApi(
        `odata/BidDetails/GetByBidder?$Filter=bidding_document_detail_id eq ${lstChoice[0].id}`,
        "GET"
      ).then((res) => {
        if (res.data.value.length == 0) {
          setIsEdit(false);
        } else {
          setIsEdit(true);
          setValueReactFormHook(res.data.value[0], setValue);
          callApi(
            `odata/TechnicalEvaluationDetails/GetToEdit?bid_detail_id=${res.data.value[0].id}`
          ).then((res) => {
            let pickDefault = [];
            res.data.value.forEach((item) => {
              if (item.is_select == true) {
                pickDefault.push(item);
              }
            });
            setLstPickTCKT(pickDefault);
            setLstTechnicalEvaluationTypes(res.data.value);
          });
        }
      });
    }
  }, [lstChoice]);

  useEffect(() => {
    if (!_.isEmpty(watch().bidding_document_id)) {
      let lstDetail = _.find(lstDocument, function (i) {
        return i.id === watch().bidding_document_id;
      });
      if (!_.isEmpty(lstDetail)) {
        setLstDocumentDetail(lstDetail.details);
      }
    }
  }, [watch().bidding_document_id]);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRow = (params) => {
    let detail = params.map((item) => {
      return {
        ...lstTechnicalEvaluationTypes[0],
        ...item,
        id: item.id,
      };
    });

    setLstParmas(detail);
    setDisable(false);
  };

  const selectedRowTCKT = (params) => {};

  //Submit form
  const onSubmit = async (data) => {
    let lstSelected = [];
    lstPickTCKT.map((item) => {
      if (item.is_select == true) {
        lstSelected.push(item.id);
      }
    });

    let dataSend = [
      {
        ...data,
        list_marks: lstSelected,
        ...lstChoice[tabActive],
        bidding_document_detail_id: lstChoice[tabActive].id,
      },
    ];

    if (lstSelected && lstSelected.length == 0) {
      openNotificationWithIcon("warning", "Vui lòng chọn tiêu chuẩn kỹ thuât");
      return;
    }
    if (isStatus === 1) {
      if (!isEdit) {
        //Thêm mới
        callApi(`odata/Bids/AddDetail?key=${objEdit.id}`, "PUT", dataSend)
          .then((res) => {
            openNotificationWithIcon("success", "Thêm thành công");
          })
          .catch((err) => {
            console.log(err);
            openNotificationWithIcon("warning", err.response.data.errors[0]);
          });
      } else {
        let dataSendEdit = {
          ...data,
          list_marks: lstSelected,
          ...lstChoice[tabActive],
          bidding_document_detail_id: lstChoice[tabActive].id,
        };
        callApi(`odata/Bids/Edit?key=${objEdit.id}`, "PUT", dataSendEdit)
          .then((res) => {
            openNotificationWithIcon("success", "Sửa thành công");
          })
          .catch((err) => {
            console.log(err);
            openNotificationWithIcon("warning", err.response.data.errors[0]);
          });
      }
    } else {
      //Sửa
    }
  };

  const handleOnChangeTab = (e) => {
    setLoadingChangeTab(true);
    callApi(
      `odata/BidDetails/GetByBidder?$Filter=bidding_document_detail_id eq ${lstChoice[e].id}`,
      "GET"
    ).then((res) => {
      let dataExmple = {
        trade_name: "",
        packing_name: "",
        quantity: "",
        price: "",
        public_price: "",
        public_code: "",
        specification: "",
        expiry: "",
        producer: "",
        origin: "",
        license: "",
        note: "",
        bidder_technical_mark: "",
      };
      let response = res.data.value;
      //check response -> true lấy dữ liệu -> false lấy lst rỗng
      if (response && response.length > 0) {
        //get data to edit
        callApi(
          `odata/TechnicalEvaluationDetails/GetToEdit?bid_detail_id=${response[0].id}`
        ).then((res) => {
          setLstTechnicalEvaluationTypes(res.data.value);

          setLoadingChangeTab(false);
        });
      } else {
        callApi(
          `odata/TechnicalEvaluationTypes?$Expand=details&$filter=medical_supplies_type_id eq ${typeId}`
        ).then((res) => {
          setLstTechnicalEvaluationTypes(res.data.value[0].details);
          setLoadingChangeTab(false);
        });
      }
      if (response.length > 0) {
        setValueReactFormHook(res.data.value[0], setValue);
      } else {
        setValueReactFormHook(dataExmple, setValue);
      }
    });
    setTabActive(e);
  };

  const handleRowChange = (e) => {
    let pickKey = e[0].key;

    // get in pickTCKT
    // let index = _.find(lstPickTCKT, function (i) {
    //   return i.id === pickKey;
    // });
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
          } else {
            setLstPickTCKT([item, ...lstPickTCKT]);
          }
        });
      } else {
        setLstPickTCKT([item]);
      }
    } else {
      lstTechnicalEvaluationTypes.map((item) => {
        if (item.id === pickKey) {
          return (item.is_select = false);
        }
      });
    }
  };

  const confirmLst = () => {
    setLstChoice(lstParmas);
    setDisable(true);
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
        <Tabs defaultActiveKey="1">
          <TabPane key={"1"} tab="Danh sách vật tư">
            <Row gutter={[8, 0]}>
              <Col span={4}>
                <Button
                  onClick={confirmLst}
                  type="primary"
                  style={{ marginTop: 22 }}
                  disabled={disables}
                >
                  Xác nhận danh sách
                </Button>
              </Col>
              <Col span={24} style={{ paddingTop: "25px" }}>
                <Spin spinning={isLoading}>
                  <div
                    className="gridView"
                    style={{ height: "calc(100vh - 400px)" }}
                  >
                    <DataGrid
                      column={columns}
                      data={lstDocument}
                      dataKey={"id"}
                      showFilterRow={true}
                      selectionChanged={selectedRow}
                      exportExcel={false}
                      selectionMode="multiple"
                      selectionFilter={["is_check", "=", true]}
                    />
                  </div>
                </Spin>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Cập nhật số lượng cung cấp thủ công" key={"2"}>
            <Tabs
              defaultActiveKey="0"
              tabPosition="left"
              onChange={(e) => handleOnChangeTab(e)}
              className="CNTC"
            >
              {lstChoice.map((item, index) => {
                return (
                  <TabPane tab={item.medical_supplies_name_byt} key={index}>
                    {loadingChangeTab ? (
                      <div style={{ textAlign: "center" }}>
                        <Spin />
                      </div>
                    ) : (
                      <>
                        <form
                          className="form"
                          id="form"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <Row gutter={[8, 0]}>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Tên trên bao bì"
                                name={register("packing_name", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Số lượng"
                                name={register("quantity", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Đơn giá"
                                name={register("price", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Đơn giá kê khai"
                                name={register("public_price", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Mã kê khai"
                                name={register("public_code", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Quy cách"
                                name={register("specification", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Hạn dùng (Tháng)"
                                name={register("expiry", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Nhà sản xuất"
                                name={register("producer", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="Xuất xứ"
                                name={register("origin", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Input
                                control={control}
                                label="GPLHSP hoặc GPNK"
                                name={register("license", {})}
                                errors={errors}
                              />
                            </Col>

                            <Col span={6}>
                              <Input
                                control={control}
                                label="Ghi chú"
                                name={register("note", {})}
                                errors={errors}
                              />
                            </Col>
                            <Col span={6}>
                              <Select
                                control={control}
                                label="Nhóm TCKT"
                                name={"technical_criteria_group_id"}
                                arrayItem={`odata/TechnicalCriteriaGroups`}
                                valueOpt="id"
                                nameOpt="name"
                                errors={errors}
                              />
                            </Col>
                          </Row>
                        </form>{" "}
                        <Col span={24} style={{ paddingTop: "25px" }}>
                          <div
                            className="gridView"
                            style={{ height: "calc(100vh - 360px)" }}
                          >
                            <DataGridTCKT
                              data={lstTechnicalEvaluationTypes}
                              dataKey={"id"}
                              selectionChanged={selectedRowTCKT}
                              exportExcel={false}
                              handleRowChange={handleRowChange}
                              showPager={true}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </TabPane>
                );
              })}
            </Tabs>
          </TabPane>
          <TabPane key={"3"} tab="Cập nhật số lượng cung cấp bằng excel">
            <ModalImportExcel
              objEdit={objEdit}
              lstPickExcel={lstPickExcel}
              lstTechnicalEvaluationTypes={lstTechnicalEvaluationTypes}
              setVisible={setVisible}
              typeId={typeId}
              modalId={modalId}
            />
          </TabPane>
        </Tabs>
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
  columns: [
    {
      caption: "Mã thuốc vật tư",
      dataField: "medical_supplies_code_bv",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "medical_supplies_name_byt",
      type: 0,
      width: "20vw",
    },
    {
      caption: "Nhóm tiêu chí đánh giá",
      dataField: "technical_evaluation_type_name",
      type: 0,
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
      format: "Money",
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
      caption: "Đã cập nhật",
      dataField: "is_check",
      type: 0,
      // width: "0vw",
    },
  ],
  columnsChoice: [
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 1,
    },
    {
      caption: "Tên thương mại",
      dataField: "medical_supplies_name_byt",
      type: 1,
    },
    {
      caption: "Tên trên bao bì",
      dataField: "packing_name",
      type: 1,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 1,
      format: "number",
    },
    {
      caption: "Đơn giá",
      dataField: "price",
      type: 1,
      format: "number",
    },
    {
      caption: "Đơn giá kê khai",
      dataField: "public_price",
      type: 1,
      format: "number",
    },
    {
      caption: "Mã kê khai ",
      dataField: "Mã kê khai",
      type: 1,
    },
    {
      caption: "Quy cách",
      dataField: "specification",
      type: 1,
    },
    {
      caption: "Hạn dùng (tháng)",
      dataField: "expiry",
      type: 1,
      format: "number",
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 1,
    },
    {
      caption: "Xuất xứ",
      dataField: "origin",
      type: 1,
    },
    {
      caption: "GPLHSP hoặc GPNK",
      dataField: "license",
      type: 1,
    },
    {
      caption: "Ghi chú",
      dataField: "note",
      type: 1,
    },
  ],
};

export default ModalCreateAndEdit;
