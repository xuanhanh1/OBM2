import React from "react";
import PropTypes from "prop-types";
import { Upload } from "antd";
import openNotificationWithIcon from "../../notification/notification";
import { PlusOutlined } from "@ant-design/icons";
/**
 * creates and returns object representation of form field
 *
 * @param {string} label - label to show with the form input
 * @param {bool} required - (*) red in label
 * @param {function} listFile - return list file upload
 */
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
export default function UploadImage(props) {
  const { label, name, required, listFile } = props;
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      openNotificationWithIcon(
        "error",
        "Bạn chỉ có thể tải lên file .JPG/PNG !"
      );
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      openNotificationWithIcon(
        "error",
        "Kích thước hình ảnh phải nhỏ hơn 5MB!"
      );
    }
    return isJpgOrPng && isLt2M ? true : Upload.LIST_IGNORE;
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onUploadImage = (info) => {
    listFile(info.fileList);
  };

  return (
    <>
      <label className={required ? "label-require" : ""}>{label}</label>
      <Upload
        listType="picture-card"
        onChange={onUploadImage}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
      >
        {uploadButton}
      </Upload>
    </>
  );
}

UploadImage.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
};
UploadImage.defaultProps = {
  label: "",
  name: "",
  required: false,
  defaultValue: "",
};
