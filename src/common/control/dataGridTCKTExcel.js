import React from "react";
import { Avatar, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Button as ButtonOut } from "devextreme-react/button";
import DataGrid, {
  Column,
  Editing,
  Selection,
  Scrolling,
  Lookup,
  RowDragging,
  KeyboardNavigation,
  MasterDetail,
  Export,
  FilterRow,
  SearchPanel,
  Paging,
  Button,
  TotalItem,
  Summary,
  ColumnChooser,
  AsyncRule,
  Pager,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import _ from "lodash";
import { Template } from "devextreme-react/core/template";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "./index.css";

import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import config from "devextreme/core/config";
import { FormatMoney, FormatDate } from "../../components/controller/Format";
config({
  defaultCurrency: "VND",
});

const loadCol = (lstColumn) => {
  var result = null;
  if (lstColumn && lstColumn.length > 0) {
    result = lstColumn.map((item, index) => {
      return (
        <Column
          dataField={item.dataField}
          key={index}
          caption={item.caption}
          allowEditing={
            item.type == 0 ||
            (!_.isUndefined(item.allowEditing) && !item.allowEditing)
              ? false
              : true
          }
          visible={item.visible}
          editCellComponent={item.dropDown}
          format={
            item.format === "Money"
              ? { minimumSignificantDigits: 3 }
              : item.format === "date"
              ? "dd/MM/yyyy"
              : item.format === "datetime"
              ? "dd/MM/yyyy HH:mm:ss"
              : ""
          }
          dataType={item.format === "date" ? "date" : ""}
          width={item.width}
          cellRender={item.customCellRender}
        >
          <Scrolling columnRenderingMode="virtual" />
          {item.type == 2 ? (
            <Lookup
              dataSource={item.dataSource.data}
              valueExpr={item.dataSource.valueExpr}
              displayExpr={item.dataSource.displayExpr}
              render={item.dataSource.render}
              idFilterArray={item.dataSource.idFilterArray}
            ></Lookup>
          ) : (
            ""
          )}
        </Column>
      );
    });
  }
  return result;
};

class DataGridTCKTExcel extends React.Component {
  constructor(props) {
    super(props);
    this.dataGridRef = React.createRef();
    this.selectorRef = React.createRef(null);
    this.dataGrid = null;
    this.priceGridRef = React.createRef();
    this.ratingGridRef = React.createRef();
    this.TCKTGridRef = React.createRef();
    this.benhDaiNgayGridRef = React.createRef();
    this.tuyenBenhVienGridRef = React.createRef();
  }
  setCellValue(newData, value, currentRowData) {
    // console.log(newData);
    // console.log(value);
    // console.log(currentRowData);
  }
  get priceDataGrid() {
    return this.priceGridRef.current.instance;
  }

  get ratingDataGrid() {
    return this.ratingGridRef.current.instance;
  }
  get TCKTDataGrid() {
    return this.TCKTGridRef.current.instance;
  }

  get benhDaiNgayDataGrid() {
    return this.benhDaiNgayGridRef.current.instance;
  }
  get tuyenBenhVienDataGrid() {
    return this.tuyenBenhVienGridRef.current.instance;
  }

  state = {
    selectedItemKeys: [],
  };

  selectionChanged = (data) => {
    if (this.props.selectionMode === "multiple") {
      this.props.selectionChanged(data.selectedRowsData);
    } else {
      this.props.selectionChanged(data.selectedRowKeys);
    }
  };

  valueChange = (data) => {
    if (data.length > 0 && !_.isEmpty(data[0].data)) {
      setTimeout(() => {
        this.props.handleRowChange(data);
      }, 100);
    }
    if (data.length > 0 && data[0].type == "remove") {
      setTimeout(() => {
        this.props.handleRowChange(data);
      }, 100);
    }
  };

  componentDidUpdate = (prevProps) => {
    if (!_.isEqual(this.props.data, prevProps.data)) {
      return true;
    }
  };

  clearSelection = () => {
    this.priceGridRef.current.instance.clearSelection();
  };

  printDataGrid() {
    this.props.onPrintChange(true);
  }

  handleRowClick = (e) => {
    if (this.selectorRef.current === e.dataIndex) {
      this.clearSelection();
      this.selectorRef.current = null;
    } else {
      this.selectorRef.current = e.dataIndex;
    }
  };

  exportGrids = () => {
    const context = this;
    const workbook = new Workbook();
    const priceSheet = workbook.addWorksheet("Danh s??ch v???t t??");
    const ratingSheet = workbook.addWorksheet("Ti??u ch?? k??? thu???t");
    const TCKTSheet = workbook.addWorksheet("Nh??m ????nh gi?? ti??u ch?? k??? thu???t");

    exportDataGrid({
      worksheet: priceSheet,
      component: context.priceDataGrid,
      topLeftCell: { row: 1, column: 1 },
    })
      .then(() =>
        exportDataGrid({
          worksheet: ratingSheet,
          component: context.ratingDataGrid,
          topLeftCell: { row: 1, column: 1 },
        })
      )
      .then(() =>
        exportDataGrid({
          worksheet: TCKTSheet,
          component: context.TCKTDataGrid,
          topLeftCell: { row: 1, column: 1 },
        })
      )

      .then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "File excel m???u.xlsx"
          );
        });
      });
  };

  asyncValidation = (params) => {
    // console.log(params);
  };

  radioCheck = (newData, value, currentRowData) => {
    // console.log("new data", newData);
    // console.log("value data", value);
    // console.log("currentRowData data", currentRowData);
    newData.is_ok = value;
  };

  render() {
    const {
      column,
      data,
      data2,
      data3,
      dataKey,
      disabled,
      enableMD,
      componentMD,
      exportExcel = true,
      showColumnLines = true,
      allowDeleting = false,
      showColumnHeaders = true,
      showFilterRow = false,
      allowView = false,
      showPager = false,
      showBtnfooter = false,
      viewObj,
      selectionMode = "single",
      exportSampleFile = false,
      infoText = "",
      cloneObj = false,
      allowEditing = false,
      typeId,
      modalId,
      allowUpdating,
      showMarkSymbol = false,
    } = this.props;
    console.log(modalId);
    return (
      <>
        <div id="exportContainer">
          <ButtonOut
            text="Export file excel"
            icon="xlsxfile"
            onClick={this.exportGrids}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <TabPanel id="tabPanel" deferRendering={false}>
          <Item title="Danh s??ch danh m???c">
            <div id="data-grid-demo">
              <DataGrid
                className="gridContainer"
                id="priceDataGrid"
                ref={this.priceGridRef}
                dataSource={data}
                keyExpr={dataKey}
                selection={{ mode: selectionMode }}
                hoverStateEnabled={true}
                showBorders={true}
                onSelectionChanged={this.selectionChanged}
                onRowClick={this.handleRowClick}
                disabled={disabled}
                columnAutoWidth={false}
                allowColumnReordering={true}
                allowColumnResizing={true}
                showColumnLines={showColumnLines}
                showColumnHeaders={showColumnHeaders}
                noDataText={"Kh??ng c?? d??? li???u"}
              >
                <Scrolling mode="standard" />
                <KeyboardNavigation
                  editOnKeyPress={true}
                  enterKeyAction={"moveFocus"}
                  enterKeyDirection={"row"}
                />
                <FilterRow
                  visible={showFilterRow}
                  applyFilter={{
                    key: "auto",
                    name: "Immediately",
                  }}
                />
                {/* <SearchPanel
                  visible={exportExcel}
                  width={240}
                  placeholder="T??m ki???m..."
                /> */}
                {/* <Export
                  enabled={exportExcel}
                  fileName={`File-${moment().format("L")}`}
                  allowExportSelectedData={exportSampleFile}
                  texts={{
                    exportAll: "Xu???t excel",
                    exportSelectedRows: "Xu???t file m???u",
                  }}
                /> */}
                <Paging enabled={true} pageSize={20} />
                {showPager ? (
                  <Pager
                    visible={true}
                    allowedPageSizes={true}
                    displayMode={"full"}
                    showInfo={true}
                    infoText={infoText}
                  ></Pager>
                ) : null}
                <Editing
                  mode="cell"
                  allowUpdating={true}
                  onChangesChange={this.valueChange}
                  allowDeleting={allowDeleting}
                  // allowAdding={true}
                  // useIcons={true}
                  texts={{
                    confirmDeleteMessage: "B???n c?? ch???c ch???n mu???n x??a ?",
                  }}
                />
                {showPager ? (
                  <Pager
                    visible={true}
                    allowedPageSizes={true}
                    displayMode={"full"}
                    showInfo={true}
                    infoText={infoText ? infoText : "C??: {2} d??ng"}
                  />
                ) : null}
                <MasterDetail enabled={enableMD} component={componentMD} />

                <Column
                  type="buttons"
                  visible={allowView || allowDeleting}
                  caption={"Thao t??c"}
                >
                  <Button name="delete" />
                  <Button
                    onClick={(e) => viewObj(e.row.data)}
                    visible={allowView}
                    render={() => {
                      return (
                        <Tooltip
                          title="Chi ti???t"
                          placement="left"
                          color={"#282c3480"}
                          className="icon-viewDetail"
                        >
                          <EyeOutlined
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              padding: "2px 10px",
                            }}
                          />
                        </Tooltip>
                      );
                    }}
                  />
                  <Button
                    hint="Th??m ng??y ngh???"
                    icon="add"
                    visible={allowEditing}
                    onClick={(e) => cloneObj(e.row.data)}
                  />
                </Column>
                <Column caption="B???nh vi???n">
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="M?? thu???c v???t t??"
                    dataField="medical_supplies_code_bv"
                  />
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="T??n"
                    dataField="medical_supplies_name_byt"
                  />
                  <Column
                    width="10vw"
                    allowEditing={false}
                    caption="Nh??m ti??u ch?? ????nh gi??"
                    dataField="technical_evaluation_type_name"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Nh??m TCKT"
                    dataField="technical_criteria_group_name"
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="S??? l?????ng"
                    dataField="quantity"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="????n gi?? k??? ho???ch"
                    dataField="plan_price"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="T??? l??? ?????m b???o d??? th???u"
                    dataField="bid_security_rate"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Ti???n ?????m b???o d??? th???u"
                    dataField="bid_security_money"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="T??nh n??ng k??? thu???t"
                    dataField="technical_features"
                  />

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Ghi ch??"
                    dataField="note_bv"
                  />
                </Column>

                <Column caption="Ph???n nh?? th???u nh???p th??ng tin">
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="T??n th????ng m???i"
                    dataField="trade_name"
                  />
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="T??n tr??n bao b??"
                    dataField="packing_name"
                  />

                  {modalId === "e46f4f15-05e4-48c0-ac22-2be87b4dca93" && (
                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption="????n gi?? "
                      dataField="price"
                    />
                  )}
                  {modalId === "e46f4f15-05e4-48c0-ac22-2be87b4dca93" && (
                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption="????n gi?? k?? khai "
                      dataField="public_price"
                      format={{ minimumSignificantDigits: 3 }}
                    />
                  )}

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="M?? k?? khai"
                    dataField="public_code"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Quy c??ch"
                    dataField="specification"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="H???n d??ng (Th??ng)"
                    dataField="expiry"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Nh?? s???n xu???t"
                    dataField="producer"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Xu???t x???"
                    dataField="origin"
                  />

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="GPLHSP ho???c GPNK"
                    dataField="license"
                  />

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Ghi ch??"
                    dataField="note_bidder"
                  />
                </Column>
                {/* vat tu */}
                {typeId === "ad8a1f68-2542-4713-9dd8-ae2700201123" ? (
                  <Column caption={"Ph???n nh?? th???u t??? ????nh gi?? (nh???p s??? ??i???m)"}>
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 1.1"
                        dataField="d11"
                      />
                    )}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 1.1 KH"
                      dataField="tc11"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 1.2"
                        dataField="d12"
                      />
                    )}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 1.2 KH"
                      dataField="tc12"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 2"
                        dataField="d2"
                      />
                    )}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 2 KH"
                      dataField="tc2"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 3"
                        dataField="d3"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 3 KH"
                      dataField="tc3"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 4"
                        dataField="d4"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 4 KH"
                      dataField="tc4"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 5"
                        dataField="d5"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 5 KH"
                      dataField="tc5"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 6"
                        dataField="d6"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 6 KH"
                      dataField="tc6"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 7"
                        dataField="d7"
                      />
                    )}
                    {/* */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 7 KH"
                      dataField="tc7"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 8"
                        dataField="d8"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 8 KH"
                      dataField="tc8"
                    />
                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption=""
                      dataField=""
                    />
                  </Column>
                ) : null}

                {/* thuoc */}
                {typeId === "be7be5ea-a37c-430b-9ac4-ae2700200555" ? (
                  <Column caption={"Ph???n nh?? th???u t??? ????nh gi?? (nh???p s??? ??i???m)"}>
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 1"
                        dataField="d1"
                      />
                    )}

                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 1 KH"
                      dataField="tc1"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 2"
                        dataField="d2"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 2 KH"
                      dataField="tc2"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 3"
                        dataField="d3"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 3 KH"
                      dataField="tc3"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 4"
                        dataField="d4"
                      />
                    )}
                    {/* */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 4 KH"
                      dataField="tc4"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 5"
                        dataField="d5"
                      />
                    )}
                    {/* */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 5 KH"
                      dataField="tc5"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 6"
                        dataField="d6"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 6 KH"
                      dataField="tc6"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 7"
                        dataField="d7"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 7 KH"
                      dataField="tc7"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 8"
                        dataField="d8"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 8 KH"
                      dataField="tc8"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 10"
                        dataField="d10"
                      />
                    )}
                    {/*
                     */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 10 KH"
                      dataField="tc10"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 11"
                        dataField="d11"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 11 KH"
                      dataField="tc11"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 12"
                        dataField="d12"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 12 KH"
                      dataField="tc12"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 13"
                        dataField="d13"
                      />
                    )}
                    {/*  */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 13 KH"
                      dataField="tc13"
                    />
                    {showMarkSymbol && (
                      <Column
                        width="3vw"
                        allowEditing={false}
                        caption="Ti??u chu???n 14"
                        dataField="d14"
                      />
                    )}
                    {/* */}
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ti??u chu???n 14 KH"
                      dataField="tc14"
                    />

                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption=""
                      dataField=""
                    />
                  </Column>
                ) : null}
              </DataGrid>
            </div>
          </Item>

          {!_.isEmpty(data2) && (
            <Item title="Ti??u chu???n ????nh gi?? v??? k??? thu???t">
              <div id="data-grid-demo">
                <DataGrid
                  className="gridContainer"
                  id="ratingDataGrid"
                  ref={this.ratingGridRef}
                  dataSource={data2}
                  keyExpr={"id"}
                  selection={{ mode: selectionMode }}
                  hoverStateEnabled={true}
                  showBorders={true}
                  onSelectionChanged={this.selectionChanged}
                  onRowClick={this.handleRowClick}
                  disabled={disabled}
                  columnAutoWidth={false}
                  allowColumnReordering={true}
                  allowColumnResizing={true}
                  showColumnLines={showColumnLines}
                  showColumnHeaders={showColumnHeaders}
                  noDataText={"Kh??ng c?? d??? li???u"}
                >
                  <Scrolling columnRenderingMode="virtual" />
                  <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"moveFocus"}
                    enterKeyDirection={"row"}
                  />
                  <FilterRow
                    visible={showFilterRow}
                    applyFilter={{
                      key: "auto",
                      name: "Immediately",
                    }}
                  />

                  <Paging enabled={true} pageSize={100} />
                  {/* {showPager ? (
                    <Pager
                      visible={true}
                      allowedPageSizes={true}
                      displayMode={"full"}
                      showInfo={true}
                      infoText={infoText}
                    ></Pager>
                  ) : null} */}

                  <MasterDetail enabled={enableMD} component={componentMD} />

                  <Column
                    allowEditing={false}
                    caption="Ti??u chu???n"
                    dataField="key1"
                    groupIndex={0}
                  />
                  <Column
                    allowEditing={false}
                    caption="Ti??u chu???n"
                    dataField="key2"
                    groupIndex={1}
                  />
                  <Column
                    allowEditing={false}
                    caption="Ti??u ch?? k??? thu???t"
                    dataField="code"
                    width="5vw"
                  />
                  <Column allowEditing={false} caption="T??n" dataField="name" />
                  <Column
                    allowEditing={false}
                    caption="??i???m ????nh gi??"
                    dataField="mark"
                    width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="K?? hi???u"
                    dataField="symbol"
                    width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="??i???m li???t"
                    dataField="is_fail"
                    width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Ghi ch??"
                    dataField="note"
                    width="25vw"
                  />
                </DataGrid>
              </div>
            </Item>
          )}
          {!_.isEmpty(data3) && (
            <Item title="Nh??m TCKT">
              <div id="data-grid-demo">
                <DataGrid
                  className="gridContainer"
                  id="TCKTDataGrid"
                  ref={this.TCKTGridRef}
                  dataSource={data3}
                  keyExpr={"id"}
                  selection={{ mode: selectionMode }}
                  hoverStateEnabled={true}
                  showBorders={true}
                  onSelectionChanged={this.selectionChanged}
                  onRowClick={this.handleRowClick}
                  disabled={disabled}
                  columnAutoWidth={false}
                  allowColumnReordering={true}
                  allowColumnResizing={true}
                  showColumnLines={showColumnLines}
                  showColumnHeaders={showColumnHeaders}
                  noDataText={"Kh??ng c?? d??? li???u"}
                >
                  <Scrolling columnRenderingMode="virtual" />
                  <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"moveFocus"}
                    enterKeyDirection={"row"}
                  />
                  <FilterRow
                    visible={showFilterRow}
                    applyFilter={{
                      key: "auto",
                      name: "Immediately",
                    }}
                  />

                  <Paging enabled={true} pageSize={100} />
                  {/* {showPager ? (
                    <Pager
                      visible={true}
                      allowedPageSizes={true}
                      displayMode={"full"}
                      showInfo={true}
                      infoText={infoText}
                    ></Pager>
                  ) : null} */}

                  <MasterDetail enabled={enableMD} component={componentMD} />

                  <Column
                    allowEditing={false}
                    caption="Lo???i v???t t??"
                    dataField="medical_supplies_type_name"
                    width="3vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="M??"
                    dataField="code"
                    width="3vw"
                  />

                  <Column
                    allowEditing={false}
                    caption="T??n"
                    dataField="name"
                    width="15vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Ghi ch??"
                    dataField="note"
                  />
                </DataGrid>
              </div>
            </Item>
          )}
        </TabPanel>
      </>
    );
  }
}

export default DataGridTCKTExcel;
