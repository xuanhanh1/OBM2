import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

import openNotificationWithIcon from "../../notification/notification";
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
const { Dragger } = Upload;
export default function UploadFile(props) {
  const {
    label,
    name,
    required,
    listFile,
    maxCount = 10,
    fileType = [],
  } = props;
  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 10;
    let successFileType = false;
    if (!_.isEmpty(fileType)) {
      successFileType = _.isEmpty(
        _.filter(fileType, (x) => _.includes(file.name, x))
      );
    }
    if (successFileType) {
      let fileName = "";
      fileType.map((item) => {
        fileName += item + " ";
      });
      openNotificationWithIcon(
        "error",
        `Bạn chỉ có thể tải lên file ${fileName} !`
      );
    }
    if (!isLt2M) {
      openNotificationWithIcon(
        "error",
        "Kích thước hình ảnh phải nhỏ hơn 10MB!"
      );
    }

    return !successFileType && isLt2M ? true : Upload.LIST_IGNORE;
  }

  const onUploadFile = (info) => {
    listFile(info.fileList);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <label className={required ? "label-require" : ""}>{label}</label>
      <br></br>
      <Upload
        multiple={true}
        onChange={onUploadFile}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
      >
        <Button icon={<UploadOutlined />} style={{ color: "#333" }}>
          Click to Upload
        </Button>
      </Upload>
      {/* <Dragger
        multiple={true}
        onChange={onUploadFile}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger> */}
      {/* <Upload
        listType="picture-card"
        onChange={onUploadFile}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
      >
        {uploadButton}
      </Upload> */}
    </div>
  );
}

UploadFile.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
};
UploadFile.defaultProps = {
  label: "",
  name: "",
  required: false,
  defaultValue: "",
};
