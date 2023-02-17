import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { InputNumber } from "antd";
import { FormatMoney } from "../../../components/controller/Format";
import _ from "lodash";

import { ErrorMessage } from "@hookform/error-message";

/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - register react-form-hooks
 * @param {string} defaultValue - default value for the input
 * @param {bool} required - (*) red in label
 * @param {function} control - control of react-form-hook
 */
function InputNumberField(props) {
  const {
    label,
    name,
    errorMessage,
    isValid,
    defaultValue,
    required,
    control,
    errors,
    disabled = false,
  } = props;

  return (
    <>
      <label className={required ? "label-require" : ""}>{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required: required }}
        render={({ field }) => (
          <InputNumber
            {...field}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            controls={false}
            disabled={disabled}
            min={0}
          />
        )}
      />
      {required ? (
        <ErrorMessage
          errors={errors}
          name={name.name}
          render={({ message }) => (
            <p style={{ color: "red", fontSize: 10 }}>
              Vui lòng nhập thông tin {label}
            </p>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
}

InputNumberField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
};
InputNumberField.defaultProps = {
  label: "",
  name: "",
  required: false,
  defaultValue: "",
};

export default React.memo(InputNumberField);
