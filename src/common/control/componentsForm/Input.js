import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash";
/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - register react-form-hooks
 * @param {string} type - input type
 * @param {string} defaultValue - default value for the input
 * @param {bool} required - (*) red in label
 */
function InputField(props) {
  const {
    label,
    type,
    name,
    defaultValue,
    required,
    readOnly,
    disabled = false,
    errors,
  } = props;

  return (
    <>
      <label className={required ? "label-require" : ""}>{label}</label>
      <input
        {...name}
        type={type}
        defaultValue={defaultValue}
        readOnly={readOnly}
        disabled={disabled}
        id={label}
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

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  readOnly: PropTypes.bool,
};
InputField.defaultProps = {
  label: "",
  type: "text",
  name: "",
  required: false,
  defaultValue: "",
  readOnly: false,
};

export default React.memo(InputField);
