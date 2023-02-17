import React from "react";
import Input from "../components/Input";
import { useForm, Controller } from "react-hook-form";

/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {string} name - input name
 * @param {string} type - input type
 * @param {string} defaultValue - default value for the input
 */
export default function createFormFieldConfig(
  label,
  name,
  type,
  defaultValue = ""
) {
  return {
    renderInput: (value, key) => {
      return (
        <Input
          key={key}
          name={name}
          type={type}
          label={label}
          isValid={isValid}
          value={value}
          errorMessage={error}
        />
      );
    },
  };
}
