import React from "react";
import { Avatar, Tooltip } from "antd";
import { EyeOutlined, FileAddOutlined } from "@ant-design/icons";
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
  Pager,
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

const loadCol = (lstColumn) => {
  var result = null;
  if (lstColumn.length > 0) {
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
          dataType={
            item.format === "date"
              ? "date"
              : item.format === "number"
              ? "number"
              : item.format === "Money"
              ? "number"
              : ""
          }
          groupIndex={item.group == 0 ? item.group : null}
          width={item.width}
          cellRender={item.customCellRender}
          // onChangesChange={(e) => console.log(e)}
          // alignment="center"
        >
          <Scrolling mode="infinite" />
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
class DataGridControl extends React.Component {
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
  selectionChanged = (data) => {
    // this.props.selectionChanged(data.selectedRowKeys);
    // console.log("data.selectedRowsData", data.selectedRowsData);
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
      exportSampleFile = true,
      showPager,
      infoText,
      selectionFilter = ["medical_supplies_name_byt", "=", "Abirateron acetat"],
      pageSize = false,
    } = this.props;

    return (
      <div id="data-grid-demo">
        <DataGrid
          id="gridContainer"
          dataSource={data}
          keyExpr={dataKey}
          selection={{ mode: selectionMode }}
          hoverStateEnabled={true}
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
          selectionFilter={selectionFilter}
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
          <Selection deferred={true} />

          <SearchPanel visible={true} width={240} placeholder="T??m ki???m..." />
          <Export
            enabled={true}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xu???t excel",
              exportSelectedRows: "Xu???t file m???u",
            }}
          />
          <Paging enabled={pageSize} pageSize={20} />

          {showPager ? (
            <Pager
              visible={true}
              allowedPageSizes={true}
              displayMode={"full"}
              showInfo={true}
              infoText={infoText ? infoText : "C??: {2} d??ng"}
            />
          ) : null}
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

          {loadCol(column)}
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

export default DataGridControl;
