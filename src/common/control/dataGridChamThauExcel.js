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

class DataGridChamThauExcel extends React.Component {
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
    const priceSheet = workbook.addWorksheet("Danh sách vật tư");
    const ratingSheet = workbook.addWorksheet("Tiêu chí kỹ thuật");
    const TCKTSheet = workbook.addWorksheet("Nhóm đánh giá tiêu chí kỹ thuật");

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
            "File excel mẫu.xlsx"
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
      modeId,
      allowUpdating,
      changesChange,
      dataSocialStatus,
      dataSocialType,
      dataBenhDaiNgay,
      dataTuyenBenhVien,
      groupByBidder = false,
    } = this.props;

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
          <Item title="Danh sách danh mục">
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
                noDataText={"Không có dữ liệu"}
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
                  placeholder="Tìm kiếm..."
                /> */}
                {/* <Export
                  enabled={exportExcel}
                  fileName={`File-${moment().format("L")}`}
                  allowExportSelectedData={exportSampleFile}
                  texts={{
                    exportAll: "Xuất excel",
                    exportSelectedRows: "Xuất file mẫu",
                  }}
                /> */}
                <Paging enabled={true} pageSize={20} />
                {showPager ? (
                  <Pager
                    visible={true}
                    allowedPageSizes={true}
                    displayMode={"full"}
                    showInfo={true}
                    infoText={infoText ? infoText : "Có: {2} dòng"}
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
                    confirmDeleteMessage: "Bạn có chắc chắn muốn xóa ?",
                  }}
                />
                <MasterDetail enabled={enableMD} component={componentMD} />

                <Column
                  type="buttons"
                  visible={allowView || allowDeleting}
                  caption={"Thao tác"}
                >
                  <Button name="delete" />
                  <Button
                    onClick={(e) => viewObj(e.row.data)}
                    visible={allowView}
                    render={() => {
                      return (
                        <Tooltip
                          title="Chi tiết"
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
                    hint="Thêm ngày nghỉ"
                    icon="add"
                    visible={allowEditing}
                    onClick={(e) => cloneObj(e.row.data)}
                  />
                </Column>
                <Column caption="Thông tin danh mục mời thầu">
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="Mã BV"
                    dataField="medical_supplies_code_bv"
                  />
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="Tên BYT"
                    dataField="medical_supplies_name_byt"
                  />
                  <Column
                    width="10vw"
                    allowEditing={false}
                    caption="Cách đánh giá về kỹ thuật"
                    dataField="technical_evaluation_type_name"
                  />
                  <Column
                    width="10vw"
                    allowEditing={false}
                    caption="Nhóm TCKT"
                    dataField="technical_criteria_group_name"
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="Số lượng"
                    dataField="quantity"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Đơn giá kế hoạch"
                    dataField="plan_price"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="Tỉ lệ đảm bảo dự thầu"
                    dataField="bid_security_rate"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Tiền đảm bảo dự thầu"
                    dataField="bid_security_money"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="3vw"
                    allowEditing={false}
                    caption="Tính năng kỹ thuật"
                    dataField="technical_features"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Ghi chú"
                    dataField="note_bv"
                  />
                </Column>

                <Column caption="Thông tin dự thầu nhà thầu cung cấp">
                  {groupByBidder ? (
                    <Column
                      width="25vw"
                      allowEditing={false}
                      caption="Tên nhà thầu"
                      dataField="bidder_name"
                    />
                  ) : (
                    <Column
                      groupIndex={0}
                      allowEditing={false}
                      caption=""
                      dataField="bidder_name"
                    />
                  )}

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Thứ tự tham gia"
                    dataField="order"
                  />
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="Tên thương mại"
                    dataField="trade_name"
                  />
                  <Column
                    width="15vw"
                    allowEditing={false}
                    caption="Tên trên bao bì"
                    dataField="packing_name"
                  />

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Đơn giá "
                    dataField="price"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Đơn giá kê khai "
                    dataField="public_price"
                    format={{ minimumSignificantDigits: 3 }}
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Mã kê khai"
                    dataField="public_code"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Quy cách"
                    dataField="specification"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Hạn dùng (Tháng)"
                    dataField="expiry"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Nhà sản xuất"
                    dataField="producer"
                  />
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Xuất xứ"
                    dataField="origin"
                  />

                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="GPLHSP hoặc GPNK"
                    dataField="license"
                  />
                  {/* <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Nhóm TCKT"
                    dataField="technical_criteria_group_name"
                  /> */}
                  <Column
                    width="5vw"
                    allowEditing={false}
                    caption="Ghi chú"
                    dataField="note_bidder"
                  />
                </Column>

                {/* vat tu */}
                {typeId === "ad8a1f68-2542-4713-9dd8-ae2700201123" && (
                  <Column caption={"Điểm đánh giá kỹ thuật của nhà thầu"}>
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1.1"
                      dataField="tc11_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1.2"
                      dataField="tc12_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 2"
                      dataField="tc2_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 3"
                      dataField="tc3_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 4"
                      dataField="tc4_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 5"
                      dataField="tc5_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 6"
                      dataField="tc6_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 7"
                      dataField="tc7_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 8"
                      dataField="tc8_bidder"
                    />
                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption="Tổng điểm"
                      dataField="bidder_technical_mark"
                    />
                  </Column>
                )}

                {typeId === "ad8a1f68-2542-4713-9dd8-ae2700201123" && (
                  <Column caption={"Chấm điểm kỹ thuật (Nhập số điểm)"}>
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1.1"
                      dataField="tc11_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1.2"
                      dataField="tc12_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 2"
                      dataField="tc2_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 3"
                      dataField="tc3_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 4"
                      dataField="tc4_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 5"
                      dataField="tc5_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 6"
                      dataField="tc6_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 7"
                      dataField="tc7_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 8"
                      dataField="tc8_bv"
                    />
                    <Column
                      width="5vw"
                      allowEditing={false}
                      caption="Ghi chú (nếu có)"
                      dataField="aa"
                    />
                  </Column>
                )}

                {/* thuoc */}
                {typeId === "be7be5ea-a37c-430b-9ac4-ae2700200555" && (
                  <Column caption={"Điểm đánh giá kỹ thuật của nhà thầu"}>
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1"
                      dataField="tc1_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 2"
                      dataField="tc2_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 3"
                      dataField="tc3_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 4"
                      dataField="tc4_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 5"
                      dataField="tc5_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 6"
                      dataField="tc6_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 7"
                      dataField="tc7_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 8"
                      dataField="tc8_bidder"
                    />

                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 10"
                      dataField="tc10_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 11"
                      dataField="tc11_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 12"
                      dataField="tc12_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 13"
                      dataField="tc13_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 14"
                      dataField="tc14_bidder"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tổng điểm"
                      dataField="bidder_technical_mark"
                    />
                  </Column>
                )}

                {typeId === "be7be5ea-a37c-430b-9ac4-ae2700200555" && (
                  <Column caption={"Chấm điểm kỹ thuật (Nhập ký tự )"}>
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 1"
                      dataField="tc1_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 2"
                      dataField="tc2_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 3"
                      dataField="tc3_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 4"
                      dataField="tc4_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 5"
                      dataField="tc5_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 6"
                      dataField="tc6_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 7"
                      dataField="tc7_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 8"
                      dataField="tc8_bv"
                    />

                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 10"
                      dataField="tc10_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 11"
                      dataField="tc11_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 12"
                      dataField="tc12_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 13"
                      dataField="tc13_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Tiêu chuẩn 14"
                      dataField="tc14_bv"
                    />
                    <Column
                      width="3vw"
                      allowEditing={false}
                      caption="Ghi chú"
                      dataField="note_bv"
                    />
                  </Column>
                )}

                <Column
                  width="5vw"
                  allowEditing={false}
                  caption="Tổng điểm vừa chấm"
                  dataField="technical_mark"
                />
                <Column
                  width="5vw"
                  allowEditing={false}
                  caption="Số người đã chấm"
                  dataField="sum_marker"
                />
                <Column
                  width="5vw"
                  allowEditing={false}
                  caption="Điểm bình quân"
                  dataField="avg_technical_mark"
                />
                <Column
                  width="5vw"
                  allowEditing={false}
                  caption=""
                  dataField=""
                />
              </DataGrid>
            </div>
          </Item>

          {!_.isEmpty(data2) && (
            <Item title="Tiêu chuẩn đánh giá về kỹ thuật">
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
                  noDataText={"Không có dữ liệu"}
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
                    caption="Tiêu chuẩn"
                    dataField="key1"
                    groupIndex={0}
                    // width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Tiêu chuẩn"
                    dataField="key2"
                    groupIndex={1}
                    // width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Tiêu chí kỹ thuật"
                    dataField="code"
                    width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Tên"
                    dataField="name"
                    // width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Điểm đánh giá"
                    dataField="mark"
                    width="5vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Ghi chú"
                    dataField="note"
                    width="25vw"
                  />
                </DataGrid>
              </div>
            </Item>
          )}
          {!_.isEmpty(data3) && (
            <Item title="Nhóm TCKT">
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
                  noDataText={"Không có dữ liệu"}
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
                    caption="Loại vật tư"
                    dataField="medical_supplies_type_name"
                    width="3vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Mã"
                    dataField="code"
                    width="3vw"
                  />

                  <Column
                    allowEditing={false}
                    caption="Tên"
                    dataField="name"
                    width="15vw"
                  />
                  <Column
                    allowEditing={false}
                    caption="Ghi chú"
                    dataField="note"
                    // width="5vw"
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

export default DataGridChamThauExcel;
