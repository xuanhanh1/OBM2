import React from "react";
import { Avatar, Tooltip } from "antd";
import { EyeOutlined, FileAddOutlined } from "@ant-design/icons";
import DataGrid, {
  Column,
  Editing,
  Summary,
  GroupItem,
  Lookup,
  RowDragging,
  KeyboardNavigation,
  MasterDetail,
  Export,
  FilterRow,
  SearchPanel,
  Paging,
  Pager,
  Button,
} from "devextreme-react/data-grid";
import _ from "lodash";
import { Template } from "devextreme-react/core/template";
import moment from "moment";
import "./index.css";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
const cellRender = (data) => {
  return (
    <Avatar
      shape="square"
      src={"data:image/png;base64," + data.value}
      size={56}
    />
  );
};

class DataGridTCKT extends React.Component {
  constructor(props) {
    super(props);
    this.dataGridRef = React.createRef();
    this.selectorRef = React.createRef(null);
    // this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    this.dataGrid = null;
  }
  state = {
    selectedItemKeys: [],
  };
  selectionChanged = async (data) => {
    if (this.props.selectionMode === "multiple") {
      // let arr = await data.component.getSelectedRowsData().then((rowData) => {
      //   // console.log("row data", rowData);
      //   // this.props.getAll(rowData);
      //   return rowData;
      // });
      // this.props.selectionChanged(arr);

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
    // if (data.length > 0 && data[0]?.type == "remove") {
    //   setTimeout(() => {
    //     this.props.handleRowChange(data);
    //   }, 100);
    //   console.log(data);
    // }
  };

  componentDidUpdate = (prevProps) => {
    if (!_.isEqual(this.props.data, prevProps.data)) {
      // this.dataGridRef.current.instance.clearSelection();
      return true;
    }
  };

  clearSelection = () => {
    this.dataGridRef.current.instance.clearSelection();
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

  calculateSelectedRow(options) {
    if (options.name === "SelectedRowsSummary") {
      if (options.summaryProcess === "start") {
        options.totalValue = 0;
      } else if (options.summaryProcess === "calculate") {
        // console.log(
        //   "options.value.ID",
        //   options.component.isRowSelected(options.value.is_select)
        // );
        if (options.value.is_select == true) {
          options.totalValue += options.value.mark;
        }
      }
    }
  }
  render() {
    const {
      column,
      data,
      dataKey,
      disabled,
      enableMD,
      componentMD,
      exportExcel = true,
      showColumnLines = true,
      allowDeleting = false,
      // focusNewRow,
      allowEditing = false,
      showColumnHeaders = true,
      showFilterRow = false,
      allowView = false,
      viewObj,
      cloneObj,
      selectionMode = "single",
      exportSampleFile = false,
      isPick = true,
      infoText,
      isMark = true,
      showPager,
    } = this.props;
    return (
      <div id="data-grid-demo">
        <DataGrid
          id="gridContainerCustom"
          dataSource={data}
          keyExpr={dataKey}
          selection={{ mode: selectionMode, deferred: true }}
          hoverStateEnabled={true}
          defaultSelectionFilter={["is_select", "=", true]}
          // showRowLines={true}
          showBorders={true}
          onSelectionChanged={this.selectionChanged}
          onRowClick={this.handleRowClick}
          disabled={disabled}
          columnAutoWidth={false}
          allowColumnReordering={true}
          allowColumnResizing={true}
          showColumnLines={showColumnLines}
          // selectedRowKeys={""}
          // onToolbarPreparing={
          //   !_.isUndefined(this.props.onPrintChange)
          //     ? this.onToolbarPreparing
          //     : () => {}
          showColumnHeaders={showColumnHeaders}
          noDataText={"Không có dữ liệu"}
          ref={this.dataGridRef}
        >
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

          <SearchPanel
            visible={exportExcel}
            width={240}
            placeholder="Tìm kiếm..."
          />
          <Export
            enabled={exportExcel}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xuất excel",
              exportSelectedRows: "Xuất file mẫu",
            }}
          />
          {showPager ? (
            <Pager
              visible={true}
              allowedPageSizes={true}
              displayMode={"full"}
              showInfo={true}
              infoText={infoText ? infoText : "Có: {2} dòng"}
            />
          ) : null}
          <Paging enabled={true} pageSize={100} />
          {/* <Scrolling mode="virtual" /> */}
          <Editing
            mode="cell"
            allowUpdating={true}
            onChangesChange={this.valueChange}
            allowDeleting={allowDeleting}
            useIcons={true}
            texts={{
              confirmDeleteMessage: "Bạn có chắc chắn muốn xóa ?",
            }}
          />
          <MasterDetail enabled={enableMD} component={componentMD} />
          {isPick && (
            <Column
              allowEditing={true}
              caption="Chọn"
              dataField="is_select"
              width="5vw"
            />
          )}

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
            caption="Tên tiêu chí kỹ thuật"
            dataField="name"
            // width="40vw"
          />
          <Column
            allowEditing={false}
            caption="Điểm đánh giá"
            dataField="mark"
            width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Ký hiệu"
            dataField="symbol"
            width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Ghi chú"
            dataField="note"
            width="25vw"
          />

          {isMark && (
            <Summary calculateCustomSummary={this.calculateSelectedRow}>
              <GroupItem
                name="SelectedRowsSummary"
                summaryType="custom"
                // valueFormat="currency"
                // displayFormat="Sum: {0}"
                showInColumn="mark"
                showInGroupFooter={false}
                alignByColumn={true}
              />
            </Summary>
          )}

          <Column
            type="buttons"
            visible={allowView || allowDeleting}
            caption={"Thao tác"}
          >
            <Button name="delete" />
            <Button
              onClick={(e) => viewObj(e.row.data)}
              visible={allowView}
              //text="Chi tiết"
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
              hint="Tách số lô,hạn dùng"
              icon="add"
              visible={allowEditing}
              onClick={(e) => cloneObj(e.row.data)}
            />
          </Column>
        </DataGrid>
      </div>
    );
  }
}

export default DataGridTCKT;
