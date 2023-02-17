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
              : ""
          }
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
class DataGridChamThau extends React.Component {
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
    if (this.props.selectionMode === "multiple") {
      // console.log(data.selectedRowsData);
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

          <SearchPanel visible={true} width={240} placeholder="Tìm kiếm..." />
          <Export
            enabled={true}
            fileName={`File-${moment().format("L")}`}
            allowExportSelectedData={exportSampleFile}
            texts={{
              exportAll: "Xuất excel",
              exportSelectedRows: "Xuất file mẫu",
            }}
          />
          <Paging enabled={true} pageSize={20} />
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

          <Column
            allowEditing={false}
            caption="Nhà thầu"
            dataField="bidder_name"
            width="25vw"
          />
          <Column
            allowEditing={false}
            caption="Tên trên bao bì"
            dataField="packing_name"
          />
          <Column
            allowEditing={false}
            caption="Số lượng"
            dataField="quantity"
            format={{ minimumSignificantDigits: 3 }}
            // width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Đơn giá"
            dataField="price"
            format={{ minimumSignificantDigits: 3 }}
            // width="5vw"
          />
          <Column
            allowEditing={false}
            caption="Đơn giá kê khai"
            dataField="public_price"
            format={{ minimumSignificantDigits: 3 }}
            // width="5vw"
          />

          <Column
            allowEditing={false}
            caption="Điểm nhà thầu chấm"
            dataField="bidder_technical_mark"
          />
          <Column
            allowEditing={false}
            caption="Điểm bình quân bệnh viện chấm"
            dataField="technical_mark"
          />
          <Column
            allowEditing={false}
            caption="Số người đã chấm"
            dataField="sum_marker"
          />
          <Column allowEditing={false} caption="Ghi chú" dataField="note" />

          {/* {loadCol(column)} */}
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

export default DataGridChamThau;
