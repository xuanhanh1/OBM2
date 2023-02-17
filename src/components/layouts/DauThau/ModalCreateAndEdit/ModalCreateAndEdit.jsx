import { Col, Divider, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { FormatYear, setValueReactFormHook } from "../../../controller/Format";

import {
  Input,
  Notification,
  _,
  callApi,
  TextArea,
  Select,
  DataGrid,
  DataGridTCKT,
} from "../../index";

import DatePicker from "../../../../common/control/componentsForm/DatePicker";
import PropTypes from "prop-types";

const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const {
    isVisible,
    setVisible,
    objEdit,
    isStatus,
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
  const [list, setList] = useState([]);
  const [lstChoice, setLstChoice] = useState([]);
  const [lstDocument, setLstDocument] = useState([]);
  const [lstTechnicalGroup, setLstTechnicalGroup] = useState([]);
  const [lstMedicalSuppliesType, setLstlMedicalSuppliesType] = useState([]);
  const [lstTeam, setLstTeam] = useState([]);
  const [lstStaffs, setLstStaffs] = useState([]);
  const [lstDocumentDetail, setLstDocumentDetail] = useState([]);
  const [lstTechnicalEvaluationTypes, setLstTechnicalEvaluationTypes] =
    useState([]);

  //   console.log("lstTechnicalEvaluationTypes", lstTechnicalEvaluationTypes);
  useEffect(() => {
    if (isStatus === 1) {
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
    }
  }, []);

  useEffect(() => {
    callApi(`odata/TechnicalCriteriaGroups`, "GET").then((res) => {
      setLstTechnicalGroup(res.data.value);
    });

    callApi(`odata/BiddingDocuments?$Expand=details`, "GET").then((res) => {
      setLstDocument(res.data.value);
    });
    callApi(`odata/TechnicalEvaluationTypes?$Expand=details`, "GET").then(
      (res) => {
        setLstTechnicalEvaluationTypes(res.data.value[0].details);
      }
    );
  }, []);

  useEffect(() => {
    if (!_.isEmpty(lstChoice)) {
      let arr = lstTechnicalEvaluationTypes.map((item) => {
        lstChoice.map((j) => {
          return {
            ...item,
            id: j.id,
            name: j.name,
          };
        });
      });
      console.log("arr", arr);
      setLstTechnicalEvaluationTypes(arr);
    }
  }, [lstChoice]);

  useEffect(() => {
    if (!_.isEmpty(watch().bidding_document_id)) {
      let lstDetail = _.find(lstDocument, function (i) {
        return i.id === watch().bidding_document_id;
      });

      setLstDocumentDetail(lstDetail.details);
    }
  }, [watch().bidding_document_id]);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRow = (params) => {
    setLstChoice(params);
  };

  //Submit form
  const onSubmit = async (data) => {
    let dataSend = {
      ...data,
      year: Number(FormatYear(data.year)),
      list_details: lstChoice,
    };

    console.log(dataSend);

    // if (isStatus === 0) {
    //   //Thêm mới
    //   callApi(`odata/BiddingDocuments`, "POST", dataSend)
    //     .then((res) => {
    //       console.log(res);
    //       openNotificationWithIcon("success", "Thêm hồ sơ thầu thành công");
    //       setVisible(true);
    //     })
    //     .catch((err) => console.log(err));
    // } else {
    //   //Sửa
    // }
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
          <Tabs defaultActiveKey="1">
            <TabPane key={1} tab="Danh sách vật tư">
              <Row gutter={[8, 0]}>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Thứ tự tham gia"
                    name={register("order")}
                    // disabled
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Người mua hồ sơ"
                    name={register("buyer", { required: true })}
                    // disabled
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày mua"
                    name="buy_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Người nộp"
                    name={register("submitter")}
                    // disabled
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày nộp"
                    name="submit_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>

                <Col span={6}>
                  <TextArea
                    label="Ghi chú"
                    control={control}
                    name={register("note")}
                  />
                </Col>

                <Divider
                  orientation="left"
                  style={{ paddingLeft: "10px" }}
                ></Divider>
                <Col span={8}>
                  <Select
                    control={control}
                    label="Danh sách bidder"
                    name={"bidder_id"}
                    arrayItem={[]}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    classDefault="input-custom"
                    classLabel="label-custom"
                  />
                </Col>
                <Col span={8}>
                  <Select
                    control={control}
                    label="Danh sách các gói thầu"
                    name={"bidding_document_id"}
                    arrayItem={lstDocument}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    classDefault="input-custom"
                    classLabel="label-custom"
                  />
                </Col>
                <Col span={24} style={{ paddingTop: "25px" }}>
                  <div
                    className="gridView"
                    style={{ height: "calc(100vh - 400px)" }}
                  >
                    <DataGrid
                      column={columns}
                      data={lstDocumentDetail}
                      dataKey={"id"}
                      showFilterRow={true}
                      selectionChanged={selectedRow}
                      exportExcel={false}
                      // allowDeleting={true}
                      selectionMode="multiple"
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Số lượng cung cấp" key={2}>
              <Col span={24} style={{ paddingTop: "25px" }}>
                <div
                  className="gridView"
                  style={{ height: "calc(100vh - 400px)" }}
                >
                  <DataGrid
                    column={columnsChoice}
                    data={lstChoice}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    allowDeleting={true}
                  />
                </div>
              </Col>
            </TabPane>
            {/* <TabPane tab="Tiếu chí kỹ thuật" key={3}>
              <Col span={24} style={{ paddingTop: "25px" }}>
                <div
                  className="gridView"
                  style={{ height: "calc(100vh - 400px)" }}
                >
                  <DataGridTCKT
                    data={lstTechnicalEvaluationTypes}
                    dataKey={"id"}
                    showFilterRow={true}
                    selectionChanged={selectedRow}
                    exportExcel={false}
                    allowDeleting={true}
                    selectionMode="multiple"
                  />
                </div>
              </Col>
            </TabPane> */}
          </Tabs>
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
  columns: [
    {
      caption: "Chi tiết hồ sơ thầu",
      dataField: "bidding_document_detail_name",
      type: 0,
    },
    {
      caption: "Loại đánh giá",
      dataField: "evaluation_type_name",
      type: 0,
    },
    {
      caption: "Nhóm TCKT",
      dataField: "technical_criteria_group_name",
      type: 0,
    },
    {
      caption: "Tên thương mại",
      dataField: "medical_supplies_name_byt",
      type: 0,
    },
    {
      caption: "Tên trên bao bì",
      dataField: "packing_name",
      type: 0,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 0,
    },
    {
      caption: "Đơn giá",
      dataField: "price",
      type: 0,
    },
    {
      caption: "Đơn giá kêkhai",
      dataField: "public_price",
      type: 0,
    },
    {
      caption: "mã kê khai ",
      dataField: "Mã kê khai",
      type: 0,
    },
    {
      caption: " Quy cách",
      dataField: "specification ",
      type: 0,
    },
    {
      caption: " Hạn dùng (tháng)",
      dataField: "expiry ",
      type: 0,
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 0,
    },
    {
      caption: " Xuất xứ",
      dataField: "origin ",
      type: 0,
    },
    {
      caption: "GPLHSP hoặc GPNK",
      dataField: "license ",
      type: 0,
    },
    {
      caption: "Ghi chú",
      dataField: "note ",
      type: 0,
    },
  ],
  columnsChoice: [
    {
      caption: "Chi tiết hồ sơ thầu",
      dataField: "bidding_document_detail_name",
      type: 0,
    },
    {
      caption: "Loại đánh giá",
      dataField: "evaluation_type_name",
      type: 0,
    },
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
      caption: "Đơn giá kêkhai",
      dataField: "public_price",
      type: 1,
      format: "number",
    },
    {
      caption: "mã kê khai ",
      dataField: "Mã kê khai",
      type: 1,
    },
    {
      caption: " Quy cách",
      dataField: "specification ",
      type: 1,
    },
    {
      caption: " Hạn dùng (tháng)",
      dataField: "expiry ",
      type: 1,
      format: "number",
    },
    {
      caption: "Nhà sản xuất",
      dataField: "producer ",
      type: 1,
    },
    {
      caption: " Xuất xứ",
      dataField: "origin ",
      type: 1,
    },
    {
      caption: "GPLHSP hoặc GPNK",
      dataField: "license ",
      type: 1,
    },
    {
      caption: "Ghi chú",
      dataField: "note ",
      type: 1,
    },
  ],
};

export default ModalCreateAndEdit;
