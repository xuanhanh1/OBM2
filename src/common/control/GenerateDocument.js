import React, { Component, useRef } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { Button } from "antd";
/**
 * creates and returns object representation of form field
 *
 * @param {string} titleBtn - label button
 * @param {string} urlDoc - url template file .docx
 * @param {string} nameFile - name file download
 * @param {string} objRender - object render into file .docx
 * @param {string} refBtn - pass ref in userRef from Parent component to child component.
 */
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
export default function GenerateDocument(props) {
  const { titleBtn, urlDoc, nameFile, objRender, refBtn, disabled } = props;
  const generateDocument = () => {
    loadFile(`${window.BASE_URL}/reports/${urlDoc}`, function (error, content) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter() {
          return "............................";
        },
      });
      doc.render(objRender);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(out, `${nameFile}.docx`);
    });
  };
  return (
    <Button
      type="primary"
      onClick={generateDocument}
      ref={refBtn}
      disabled={disabled}
    >
      {titleBtn}
    </Button>
  );
}
