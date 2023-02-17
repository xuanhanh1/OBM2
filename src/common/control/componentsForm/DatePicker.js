import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";
import { DatePicker } from "antd";

/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - string
 * @param {string} defaultValue - default value for the input
 * @param {bool} required - (*) red in label
 * @param {function} control - control of react-form-hook
 * @param {bool} disabled - disable date picker
 */
function DatePickerField(props) {
  const {
    label,
    name,
    errorMessage,
    isValid,
    defaultValue,
    required,
    control,
    disabled,
    disabledDate = false,
    showTime = false,
    format = "DD/MM/YYYY",
    errors,
    allowClear = false,
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
          <DatePicker
            {...field}
            placeholder=""
            disabled={disabled}
            disabledDate={disabledDate}
            showTime={showTime}
            format={format}
            allowClear={allowClear}
            required={required}
          />
        )}
      />
      {required ? (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p style={{ color: "red", fontSize: 10 }}>
              Vui lòng chọn thông tin {label}
            </p>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
}

DatePickerField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
};
DatePickerField.defaultProps = {
  label: "",
  name: "",
  required: false,
  defaultValue: "",
  disabled: false,
};

export default DatePickerField;
