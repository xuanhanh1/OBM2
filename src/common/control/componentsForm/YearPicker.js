import React from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DatePicker } from "antd";
import { ErrorMessage } from "@hookform/error-message";

import moment from "moment";
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
function YearPickerField(props) {
  const {
    label,
    name,
    errorMessage,
    placeholder,
    isValid,
    defaultValue,
    required,
    control,
    disabled,
    disabledDate = false,
    showTime = false,
    format = "YYYY",
    errors,
    allowClear = false,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <label className={required ? "label-require" : ""}>{t(label)}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required: required }}
        render={({ field }) => (
          <DatePicker
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            disabledDate={disabledDate}
            showTime={showTime}
            format={format}
            allowClear={allowClear}
            picker="year"
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
              Vui lòng chọn {t(label)}
            </p>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
}

YearPickerField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
};
YearPickerField.defaultProps = {
  label: "",
  name: "",
  required: false,
  defaultValue: "",
  disabled: false,
};

export default YearPickerField;
