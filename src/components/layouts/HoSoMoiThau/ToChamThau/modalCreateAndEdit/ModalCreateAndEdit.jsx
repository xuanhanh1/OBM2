import { Col, Divider, Modal, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getAllMenus } from "../../../../../redux/actions/Menu";
import { setValueReactFormHook } from "../../../../controller/Format";
import {
  Input,
  Notification,
  _,
  callApi,
  TextArea,
  Select,
  DataGrid,
} from "../../../index";
import openNotificationWithIcon from "../../../../../common/notification/notification";
import DatePicker from "../../../../../common/control/componentsForm/DatePicker";
import PropTypes from "prop-types";
const { TabPane } = Tabs;

function ModalCreateAndEdit(props) {
  const { isVisible, setVisible, objEdit, isStatus, setObjEdit, columns } =
    props;

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
  const [listChoice, setListChoice] = useState([]);
  const [lstStaff, setLstStaff] = useState([]);
  const [lstNumber, setLstNumber] = useState([]);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (isStatus === 1) {
      console.log(objEdit);
      setValueReactFormHook(objEdit, setValue);
      setDisableOne(true);
    }
  }, []);

  useEffect(() => {
    callApi(`odata/Staffs?$filter=bidder_id eq null`, "GET").then((res) => {
      setLstStaff(res.data.value);
      // setValue("lst_technical", res.data.value[0].name);
    });
  }, []);

  useEffect(() => {
    let newArr = _.remove(lstStaff, function (i) {
      return i.id === watch().leader_id;
    });
    // lstStaff.map((item, index) => {
    //   if (item.id === watch().leader_id) {
    //     lstStaff.splice(index, 1);
    //   }
    // });
    if (!_.isEmpty(watch().leader_id)) {
      setIsDisable(true);
    }
    console.log("lstStaff", lstStaff);
    setLstNumber(lstStaff);
  }, [watch().leader_id]);

  useEffect(() => {
    let objItem = _.find(lstStaff, function (i) {
      return i.id === watch().number_id;
    });
    console.log("objItem", objItem);
    if (_.isEmpty(listChoice)) {
      if (objItem != undefined) {
        setListChoice([objItem]);
      }
    } else {
      let item = _.find(listChoice, function (i) {
        return i.id === watch().number_id;
      });

      if (item != undefined) {
        openNotificationWithIcon("warning", "Vật tư đã có trong danh sách.");
        return;
      } else {
        // listChoice.push(objItem);
        setListChoice([...listChoice, objItem]);
      }
    }
  }, [watch().number_id]);

  const handleCancel = () => {
    setVisible(false);
  };

  const selectedRow = ([params]) => {
    // const obj = _.find(lstRoles, (x) => x.Id === params);
    // setObjEdit(obj);
  };

  //Submit form
  const onSubmit = async (data) => {
    console.log(data);
    console.log("lst choice ", listChoice);
    let arr = listChoice.map((item) => item.id);
    let dataSend = {
      ...data,
      list_staffs: arr,
    };

    if (isStatus === 0) {
      //Thêm mới
      callApi(`odata/BidEvaluationTeams`, "POST", dataSend)
        .then((res) => {
          openNotificationWithIcon("success", "Thêm tổ chấm thầu thành công");
          setVisible(false);
        })
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon("warning", err.response.data.errors[0]);
        });
    } else {
      //Sửa
    }
  };

  return (
    <div>
      <Modal
        title={isStatus === 0 ? t("Thêm tổ chấm thầu") : t("Sửa tổ chấm thầu")}
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
          <Row gutter={[8, 0]}>
            <Col span={6}>
              <Input
                control={control}
                label="Mã tổ chấm thầu"
                name={register("code")}
                // disabled
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Tên tổ chấm thầu"
                name={register("name", { required: true })}
                // disabled
                required
                errors={errors}
              />
            </Col>
            <Col span={6}>
              <Input
                control={control}
                label="Ghi chú"
                name={register("note")}
                // disabled
              />
            </Col>
            <Col span={8}>
              <Select
                control={control}
                label="Tổ trưởng tổ chấm thầu"
                name={"leader_id"}
                arrayItem={lstStaff}
                valueOpt="id"
                nameOpt="name"
                errors={errors}
                classDefault="input-custom"
                classLabel="label-custom"
                disabled={isDisable}
              />
            </Col>

            <Col span={8}>
              <Select
                control={control}
                label="Thành viên"
                name={"number_id"}
                arrayItem={lstNumber}
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
                style={{ height: "calc(100vh - 300px)" }}
              >
                <DataGrid
                  column={columns}
                  data={listChoice}
                  dataKey={"id"}
                  showFilterRow={true}
                  selectionChanged={selectedRow}
                  exportExcel={false}
                  // allowView={true}
                />
              </div>
            </Col>
          </Row>
        </form>
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
    },
    {
      caption: "Tên nhân viên",
      dataField: "name",
      type: 0,
    },
    {
      caption: "Khoa phòng",
      dataField: "department_name",
      type: 0,
    },
    {
      caption: "Chức vụ",
      dataField: "position_name",
      type: 0,
    },
  ],
};

export default ModalCreateAndEdit;
