import { Col, Divider, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { CSVDownload } from "react-csv";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  FormatYear,
  setValueReactFormHook,
} from "../../../../controller/Format";
import YearPickerField from "../../../../../common/control/componentsForm/YearPicker";
import {
  Input,
  _,
  callApi,
  Select,
  DataGrid,
  UploadFile,
} from "../../../index";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import DatePicker from "../../../../../common/control/componentsForm/DatePicker";
import PropTypes from "prop-types";
import moment from "moment";
const { TabPane } = Tabs;

function childRender(isThuoc, lstCriteriaGroups, isFileExcel, control, errors) {
  return (
    <Select
      control={control}
      label="Nhóm TCKT"
      name={"lst_TCKT"}
      arrayItem={lstCriteriaGroups}
      valueOpt="id"
      nameOpt="name"
      errors={errors}
      required={isFileExcel != null ? false : true}
    />
  );
}

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, columns } =
    props;

  const [isFileExcel, setFileExcel] = useState(null);
  const [isLoadingExcel, setLoading] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isResult, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const [respone, setRespone] = useState(false);
  const [dataRespone, setDataRespone] = useState([]);
  const [list, setList] = useState([]);
  const [listChoice, setListChoice] = useState([]);
  const [lstTechnicalGroup, setLstTechnicalGroup] = useState([]);
  const [lstCriteriaGroups, setLstCriteriaGroups] = useState([]);
  const [isThuoc, setIsThuoc] = useState(true);

  useEffect(() => {
    if (watch().type_id === "be7be5ea-a37c-430b-9ac4-ae2700200555") {
      setIsThuoc(true);
    } else {
      setIsThuoc(false);
    }
  }, [watch().type_id]);

  useEffect(() => {
    if (isStatus == 1) {
      if (objEdit.status_id === "dbf2da25-f93a-4989-a00c-51c179f2f966") {
        openNotificationWithIcon(
          "warning",
          "Đã phát hành hồ sơ, không được sửa"
        );
        setVisible(true);
        return;
      }
      // let arr = objEdit.details.map((item) => {
      //   return {
      //     ...item,
      //     code_bv: item.medical_supplies_code_bv,
      //     name_byt: item.medical_supplies_name_byt,
      //     name: item.technical_evaluation_type_name,
      //   };
      // });
      objEdit.public_date = moment(objEdit.public_date);
      objEdit.opening_date = moment(objEdit.opening_date);
      objEdit.decision_date = moment(objEdit.decision_date);
      objEdit.closing_date = moment(objEdit.closing_date);
      objEdit.year = moment(objEdit.year, "YYYY");

      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
      // setListChoice(arr);
    }
  }, []);

  useEffect(() => {
    callApi(`odata/TechnicalEvaluationTypes`, "GET").then((res) => {
      setLstTechnicalGroup(res.data.value);
    });
    callApi(`odata/TechnicalCriteriaGroups`, "GET").then((res) => {
      setLstCriteriaGroups(res.data.value);
    });
  }, []);

  useEffect(() => {
    setDisableOne(true);
    if (watch().type_id) {
      callApi(
        `odata/MedicalSupplies?$filter=type_id eq ${
          watch().type_id
        } and year eq ${FormatYear(watch().year)}`,
        "GET"
      )
        .then((res) => {
          res.data.value.map((item) => {
            item.name_byt = item.code_byt + " - " + item.name_byt;
          });
          setList(res.data.value);
        })
        .catch((err) => console.log(err));
    }
  }, [watch().type_id, watch().year]);

  useEffect(() => {
    let object;

    //get danh sach thuoc vat tu
    let objItem = _.find(list, function (i) {
      return i.id === watch().list_item_id;
    });

    //get obj nhom tiêu chuẩn kỹ thuật
    let objTechnicalItem = _.find(lstTechnicalGroup, function (i) {
      return i.id === watch().lst_technical;
    });
    //get obj TCKT
    let objCriteriaItem = _.find(lstCriteriaGroups, function (i) {
      return i.id === watch().lst_TCKT;
    });

    if (objTechnicalItem != undefined && objCriteriaItem != undefined) {
      object = {
        ...objTechnicalItem,
        name_TCKT: objCriteriaItem.name,
        id_TCKT: objCriteriaItem.id,
        technical_criteria_group_id: objCriteriaItem.id,
        medical_supplies_id: watch().list_item_id, //loại danh mục nào
        technical_evaluation_type_id: objTechnicalItem.id, //tiêu chuẩn kỹ thuật nào
        ...objItem,
      };
    } else if (objTechnicalItem != undefined) {
      object = {
        ...objTechnicalItem,
        medical_supplies_id: watch().list_item_id, //loại danh mục nào
        technical_evaluation_type_id: objTechnicalItem.id, //tiêu chuẩn kỹ thuật nào
        ...objItem,
      };
    }

    if (_.isEmpty(listChoice)) {
      if (objItem != undefined && objTechnicalItem != undefined) {
        setListChoice([object]);
      }
    } else {
      let item = _.find(listChoice, function (i) {
        return i.id === watch().list_item_id;
      });

      if (item != undefined) {
        openNotificationWithIcon("warning", "Vật tư đã có trong danh sách.");
        return;
      } else {
        setListChoice([...listChoice, object]);
      }
    }
  }, [watch().list_item_id, watch().lst_technical, watch().lst_TCKT]);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRow = ([params]) => {};

  //Submit form
  const onSubmit = async (data) => {
    let dataSend = {
      ...data,
      technical_rate: Number(watch().technical_rate), //tỉ lệ kỹ thuật
      financial_rate: Number(watch().financial_rate), // tỉ lệ tài chính
      favour_rate: Number(watch().favour_rate), // tỉ lệ ưu đãi
      year: Number(FormatYear(data.year)),
      list_details: listChoice,
    };

    if (isStatus === 0) {
      //Thêm mới
      let result = await callApi(`odata/BiddingDocuments`, "POST", dataSend)
        .then((res) => {
          setResult(res.data);
          if (isFile) {
            callApi(
              `odata/BiddingDocumentDetails/ImportExcel?bidding_document_id=${res.data.id} `,
              "POST",
              isFileExcel,
              "multipart/form-data"
            )
              .then((res) => {
                openNotificationWithIcon(
                  "success",
                  "Thêm hồ sơ thầu thành công"
                );
                setListChoice(res.data);
                setIsLoading(false);
              })
              .catch((err) => {
                if (!_.isEmpty(err.response.data.errors)) {
                  openNotificationWithIcon(
                    "warning",
                    err.response.data.errors[0]
                  );
                }

                setIsLoading(false);

                setDataRespone(err.response.data);
                setRespone(true);
              });
          } else if (listChoice && listChoice.length > 0) {
            let dataSend2 = {
              ...listChoice,
              bidding_document_id: res.data.id,
            };

            callApi(
              `odata/BiddingDocumentDetails?bidding_document_id=${res.data.id}`,
              "POST",
              listChoice
            )
              .then((res) => {
                openNotificationWithIcon(
                  "success",
                  "Thêm hồ sơ thầu thành công"
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
          return true;
        })
        .catch((err) => {
          console.log(err.response);
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        });
      console.log("result", result);
      if (result) {
        setVisible(false);
      }
    } else {
      //Sửa

      let result = await callApi(
        `odata/BiddingDocuments?key=${objEdit.id}`,
        "PUT",
        {
          ...data,
          year: FormatYear(data.year),
        }
      )
        .then((res) => {
          return true;
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        });

      if (result) {
        setVisible(false);
      }
    }
  };

  const listFileUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e[0]?.originFileObj);

    setFileExcel(formData);
    setIsFile(true);
  };
  const handleRowChange = (e) => {
    let isHasUndefined = false;
    //them tinh tong tien dam bao du thau
    let arr = listChoice.map((item) => {
      if (
        item.bid_security_rate != undefined &&
        item.quantity != undefined &&
        item.plan_price != undefined
      ) {
        return {
          ...item,
          bid_security_money:
            item.quantity * item.bid_security_rate * item.plan_price * 0.01,
        };
      }
    });

    //neu true co truong chua nhap
    arr.forEach((item) => {
      if (item == undefined) {
        isHasUndefined = true;
      }
    });
    // có underfined thi không set
    if (!isHasUndefined) {
      setListChoice(arr);
    }
  };

  return (
    <div>
      <Modal
        title={
          isStatus === 0 ? t("Thêm hồ sơ mời thầu") : t("Sửa hồ sơ mời thầu")
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
            <TabPane tab="Thông tin gói thầu" key="1">
              <Row gutter={[8, 0]}>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Mã gói thầu"
                    name={register("code", { required: true })}
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Tên gói thầu"
                    name={register("name", { required: true })}
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Dự án"
                    name={register("project")}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Số quyết định"
                    name={register("decision_number", { required: true })}
                    required
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày quyết định"
                    name="decision_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày phát hành"
                    name="public_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày mở thầu"
                    name="opening_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <DatePicker
                    placeholder="Chọn ngày"
                    label="Ngày kết thúc thầu"
                    name="closing_date"
                    control={control}
                    defaultValue={null}
                    required={true}
                    errors={errors}
                  />
                </Col>
                <Col span={6}>
                  <Select
                    control={control}
                    label="Tổ chấm thầu"
                    name={"team_id"}
                    arrayItem={`odata/BidEvaluationTeams`}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    classDefault="input-custom"
                    classLabel="label-custom"
                    required
                  />
                </Col>
                <Col span={6}>
                  <Select
                    control={control}
                    label="Người xác nhận"
                    name={"reviewer_id"}
                    arrayItem={`odata/Staffs?$filter=bidder_id eq null`}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    classDefault="input-custom"
                    classLabel="label-custom"
                    required
                  />
                </Col>
                <Col span={6}>
                  <YearPickerField
                    placeholder="Chọn năm"
                    label="Năm"
                    name="year"
                    control={control}
                    errors={errors}
                    defaultValue={moment(new Date(), "YYYY")}
                    required={true}
                  />
                </Col>
                <Col span={6}>
                  <Input
                    label="Ghi chú"
                    control={control}
                    name={register("note")}
                  />
                </Col>

                <Col span={6}>
                  <Select
                    control={control}
                    label="Hình thức đấu thầu"
                    name={"form_id"}
                    arrayItem={`odata/BiddingForms`}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    disable={disableOne}
                    required
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Tỉ lệ ưu đãi (%)"
                    name={register("favour_rate", { required: true })}
                    required
                    errors={errors}
                    type="number"
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Tỉ lệ kỹ thuật"
                    name={register("technical_rate", { required: true })}
                    required
                    errors={errors}
                    type="number"
                  />
                </Col>
                <Col span={6}>
                  <Input
                    control={control}
                    label="Tỉ lệ tài chính"
                    name={register("financial_rate", { required: true })}
                    required
                    errors={errors}
                    type="number"
                  />
                </Col>
                <Col span={6}>
                  <Select
                    control={control}
                    label="Phương thức đấu thầu"
                    name={"mode_id"}
                    arrayItem={`odata/BiddingModes`}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    required
                  />
                </Col>

                <Col span={12}>
                  <Select
                    control={control}
                    label="Loại gói thầu"
                    name={"type_id"}
                    arrayItem={`odata/MedicalSuppliestypes`}
                    valueOpt="id"
                    nameOpt="name"
                    errors={errors}
                    disable={disableOne}
                  />
                </Col>
              </Row>
            </TabPane>
            {isStatus == 0 && (
              <TabPane tab="Danh sách danh mục" key="2">
                <Divider orientation="left" style={{ paddingLeft: "10px" }}>
                  Danh mục thuốc/vật tư
                </Divider>

                <Tabs defaultActiveKey="1" tabPosition="left">
                  <TabPane tab="Cách 1" key="1">
                    {/* danh sach vat tu */}
                    <Row gutter={[8, 0]}>
                      <Col span={6}>
                        <Select
                          control={control}
                          label="Tiêu chuẩn đánh giá về kỹ thuật"
                          name={"lst_technical"}
                          arrayItem={lstTechnicalGroup}
                          valueOpt="id"
                          nameOpt="name"
                          errors={errors}
                          required={isFileExcel != null ? false : true}
                        />
                      </Col>

                      {/* <Col span={6}>
                        {isThuoc &&
                          childRender(
                            isThuoc,
                            lstCriteriaGroups,
                            isFileExcel,
                            control,
                            errors
                          )}
                      </Col> */}

                      <Col span={24}>
                        <Select
                          control={control}
                          label="Danh sách"
                          name={"list_item_id"}
                          arrayItem={list}
                          valueOpt="id"
                          nameOpt="name_byt"
                          errors={errors}
                        />
                      </Col>
                    </Row>

                    <Col span={24}>
                      <div
                        className="gridView"
                        style={{ height: "calc(100vh - 400px)" }}
                      >
                        <DataGrid
                          column={columns}
                          data={listChoice}
                          dataKey={"id"}
                          showFilterRow={true}
                          selectionChanged={selectedRow}
                          exportExcel={false}
                          allowDeleting={true}
                          handleRowChange={handleRowChange}
                        />
                      </div>
                    </Col>
                  </TabPane>
                  <TabPane tab="Cách 2" key="2">
                    {/* upload file excel  */}
                    <Col span={3}>
                      <UploadFile
                        label="File danh mục"
                        listFile={listFileUpload}
                        maxCount={1}
                        fileType={[".xlsx", ".xlsm", ".xls"]}
                      />
                    </Col>
                  </TabPane>
                </Tabs>
              </TabPane>
            )}
          </Tabs>
        </form>

        {respone ? (
          <CSVDownload
            data={dataRespone}
            target="_blank"
            filename={"File lỗi"}
          />
        ) : null}
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
      caption: "Mã danh mục",
      dataField: "code_bv",
      type: 0,
    },
    {
      caption: "Tên",
      dataField: "name_byt",
      type: 0,
      width: "15vw",
    },
    {
      caption: "Nhóm tiêu chuẩn kỹ thuật",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Nhóm TKCT",
      dataField: "name_TCKT",
      type: 1,
    },
    {
      caption: "Số lượng",
      dataField: "quantity",
      type: 1,
      format: "number",
    },
    {
      caption: "Đơn giá kế hoạch",
      dataField: "plan_price",
      type: 1,
      format: "number",
    },
    {
      caption: "Tỉ lệ đảm bảo dự thầu",
      dataField: "bid_security_rate",
      type: 1,
      format: "number",
    },
    {
      caption: "Tiền đảm bảo dự thầu",
      dataField: "bid_security_money",
      type: 0,
      format: "number",
    },
    {
      caption: "Tính năng kỹ thuật",
      dataField: "technical_features",
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
