import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import callApi from "../../../config/configApi";
/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - register react-form-hooks
 * @param {bool} required - (*) red in label
 * @param {array} arrayItem - array render select option
 * @param {string} valueOpt - string value option when selected
 * @param {string} nameOpt - string name show option
 * @param {bool} optNull - option empty when start
 */
const { Option } = Select;
function SelectField(props) {
  const {
    label,
    name,
    required = false,
    arrayItem,
    valueOpt,
    nameOpt,
    optNull = true,
    disabled = false,
    control,
    defaultValue = "",
    errors,
    classDefault,
    classLabel = "",
    addPlusIcon = false,
    setOpenModal = () => {},
    customRender = (item) => {
      return item[nameOpt];
    },
  } = props;
  const timeRef = useRef();
  const { t } = useTranslation();
  const [array, setArray] = useState(
    typeof arrayItem === "string" ? [] : arrayItem
  );
  const getData = () => {
    if (typeof arrayItem === "string") {
      callApi(arrayItem, "GET").then((res) => {
        clearInterval(timeRef.current);
        setArray(res.data.value);
      });
    } else {
      setArray(arrayItem);
    }
  };
  useEffect(() => {
    if (typeof arrayItem === "string") {
      timeRef.current = setInterval(() => {
        if (!_.isEmpty(control._formValues[name])) {
          getData();
        }
      }, 100);
      // clearInterval(timeRef.current);
    }
  }, []);

  useEffect(() => {
    if (typeof arrayItem === "object") {
      setArray(arrayItem);
    }
  }, [arrayItem]);

  const onFocus = () => {
    if (array.length === 0) {
      getData();
    }
  };
  return (
    <React.Fragment>
      <label className={required ? "label-require" : classLabel}>
        {t(label)}
      </label>
      <Controller
        name={name}
        control={control}
        className={classDefault}
        defaultValue={
          optNull ? defaultValue : !_.isEmpty(array) ? array[0][valueOpt] : ""
        }
        rules={{ required: required }}
        render={({ field }) => (
          <Select
            className={`select-custom ${classDefault}`}
            {...field}
            showSearch
            filterOption={(input, option) => {
              if (!_.isNull(option.key)) {
                return _.includes(
                  _.lowerCase(
                    _.find(array, (x) => x[valueOpt] === option.key)[nameOpt]
                  ),
                  _.lowerCase(input)
                );
              }
              // _.includes(_.lowerCase(option.children), _.lowerCase(input))
            }}
            suffixIcon={
              addPlusIcon ? (
                <PlusOutlined onClick={() => setOpenModal(true)} />
              ) : (
                ""
              )
            }
            disabled={disabled}
            onFocus={() => onFocus()}
          >
            {optNull ? <Option value={null} /> : <></>}
            {_.map(array, (item) => {
              return (
                <Option value={item[valueOpt]} key={item[valueOpt]}>
                  {customRender(item)}
                </Option>
              );
            })}
          </Select>
        )}
      />
      {required ? (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p style={{ color: "red", fontSize: 10 }}>
              Vui lòng chọn thông tin {t(label)}
            </p>
          )}
        />
      ) : (
        <></>
      )}
    </React.Fragment>
  );
}

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMessage: PropTypes.string,
  arrayItem: PropTypes.array,
  valueOpt: PropTypes.string,
  nameOpt: PropTypes.string,
  optNull: PropTypes.bool,
};

export default React.memo(SelectField);
