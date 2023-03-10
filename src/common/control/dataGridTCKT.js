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
          noDataText={"Kh??ng c?? d??? li???u"}
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
            placeholder="T??m ki???m..."
          />
          <Export
            enabled={exportExcel}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xu???t excel",
              exportSelectedRows: "Xu???t file m???u",
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
          <Paging enabled={true} pageSize={100} />
          {/* <Scrolling mode="virtual" /> */}
          <Editing
            mode="cell"
            allowUpdating={true}
            onChangesChange={this.valueChange}
            allowDeleting={allowDeleting}
            useIcons={true}
            texts={{
              confirmDeleteMessage: "B???n c?? ch???c ch???n mu???n x??a ?",
            }}
          />
          <MasterDetail enabled={enableMD} component={componentMD} />
          {isPick && (
            <Column
              allowEditing={true}
              caption="Ch???n"
              dataField="is_select"
              width="5vw"
            />
          )}

          <Column
            allowEditing={false}
            caption="Ti??u chu???n"
            dataField="key1"
            groupIndex={0}
            // width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Ti??u chu???n"
            dataField="key2"
            groupIndex={1}
            // width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Ti??u ch?? k??? thu???t"
            dataField="code"
            width="5vw"
          />
          <Column
            allowEditing={false}
            caption="T??n ti??u ch?? k??? thu???t"
            dataField="name"
            // width="40vw"
          />
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
            caption="Ghi ch??"
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
            caption={"Thao t??c"}
          >
            <Button name="delete" />
            <Button
              onClick={(e) => viewObj(e.row.data)}
              visible={allowView}
              //text="Chi ti???t"
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
              hint="T??ch s??? l??,h???n d??ng"
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
