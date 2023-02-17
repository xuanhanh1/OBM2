import React from "react";
import DataGrid, {
  Column,
  Editing,
  Selection,
  Scrolling,
  Lookup,
  KeyboardNavigation,
  MasterDetail,
  Export,
  FilterRow,
  SearchPanel,
  Paging,
  Pager,
  Button,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import ODataStore from "devextreme/data/odata/store"; // phải có import ODataStore. nếu bỏ sẽ lỗi
import _ from "lodash";
import "./index.css";
import { Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { moment } from "../../components/layouts";
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
              ? "dd/MM/yyyy HH:mm:ss"
              : item.format === "dateNotTime"
              ? "dd/MM/yyyy"
              : ""
          }
          dataType={item.format === "date" ? "date" : ""}
          width={item.width}
          cellRender={item.customCellRender}
          // onChangesChange={(e) => console.log(e)}
          alignment={item.alignment}
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
const loadSummary = (listItems) => {
  let result = null;
  if (listItems.length > 0) {
    return (
      <Summary>
        {listItems.map((item) => (
          <TotalItem
            column={item.column}
            summaryType={item.summaryType}
            customizeText={item.custom}
          />
        ))}
      </Summary>
    );
  } else {
    return null;
  }
};
const initOdataStore = (
  urlApi,
  dataKey,
  fieldTypes,
  options = { filter: [], sort: [] },
  expand = []
) => {
  let dataSourceOptions = {
    store: {
      type: "odata",
      url: `${window.BASE_URL}${urlApi}`,
      beforeSend: (e) => {
        e.headers = {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        };
      },
      key: dataKey,
      fieldTypes: fieldTypes,
      version: 4,
    },
    expand,
  };
  if (options.filter.length > 0) {
    dataSourceOptions.filter = [...options.filter];
  }
  if (options.sort.length > 0) {
    dataSourceOptions.sort = [...options.sort];
  }
  return dataSourceOptions;
};
class DataGridOdataControl extends React.Component {
  constructor(props) {
    super(props);
    this.dataGridRef = React.createRef();
    this.selectorRef = React.createRef(null);
  }
  state = {
    odataStore: initOdataStore(
      this.props.urlApi,
      this.props.dataKey,
      this.props.fieldTypes,
      this.props.options,
      this.props.expand
    ),
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.options === undefined) {
      return nextProps.urlApi !== this.props.urlApi;
    } else {
      return (
        nextProps.urlApi !== this.props.urlApi ||
        !(
          _.isEqual(this.props.options, nextProps.options) &&
          _.isEqual(this.state.odataStore, nextState.odataStore)
        )
      );
    }
  }
  componentDidUpdate = (prevProps) => {
    if (!_.isEqual(this.props.urlApi, prevProps.urlApi)) {
      const dataSource = this.dataGridRef.current.instance.getDataSource();
      if (this.props.urlApi.toLowerCase() === prevProps.urlApi.toLowerCase()) {
        dataSource.reload();
      } else {
        const store = initOdataStore(
          this.props.urlApi,
          this.props.dataKey,
          this.props.fieldTypes,
          this.props.options
        );
        this.setState({ odataStore: store });
      }
      this.clearSelection();
      return;
    }
    if (!_.isEqual(this.props.options, prevProps.options)) {
      if (this.props.options.filter.length > 0) {
        const store = initOdataStore(
          this.props.urlApi,
          this.props.dataKey,
          this.props.fieldTypes,
          this.props.options
        );
        this.setState({ odataStore: store });
      } else {
        this.dataGridRef.current.instance.clearFilter();
      }

      this.clearSelection();
    }
  };

  clearSelection = () => {
    this.dataGridRef.current.instance.clearSelection();
  };

  selectionChanged({ selectedRowsData }) {
    if (this.props.selectionMode === "multiple") {
      this.props.selectionChanged(selectedRowsData);
    } else {
      this.props.selectionChanged(selectedRowsData[0]);
    }
  }

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

  onToolbarPreparing = (e) => {
    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        icon: "print",
        onClick: this.printDataGrid.bind(this),
        visible: !_.isUndefined(this.props.onPrintChange),
      },
    });
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
      summaryTotalItems = [],
      dataKey,
      disabled,
      enableMD,
      componentMD,
      exportExcel = true,
      showColumnLines = true,
      allowDeleting = false,
      // focusNewRow,
      showColumnHeaders = true,
      onPrintChange,
      showFilterRow = false,
      allowView = false,
      viewObj,
      selectionMode = "single",
      pageSize = 1,
      showPager = true,
      defaultTextSearch = "",
      exportSampleFile = false,
      search = true,
    } = this.props;

    return (
      <div id="data-grid-demo">
        <DataGrid
          id="gridContainer"
          dataSource={this.state.odataStore}
          //keyExpr={dataKey}
          //selection={{ mode: selectionMode }}
          hoverStateEnabled={true}
          // showRowLines={true}
          showBorders={true}
          onSelectionChanged={(e) => this.selectionChanged(e)}
          onRowClick={this.handleRowClick}
          disabled={disabled}
          columnAutoWidth={false}
          allowColumnReordering={true}
          allowColumnResizing={true}
          showColumnLines={showColumnLines}
          // selectedRowKeys={""}
          showColumnHeaders={showColumnHeaders}
          noDataText={"Không có dữ liệu"}
          defaultSelectionFilter={[]}
          ref={this.dataGridRef}
        >
          <Selection mode={selectionMode} allowSelectAll={false} />

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
            visible={search}
            width={240}
            placeholder="Tìm kiếm..."
            defaultText={defaultTextSearch}
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

          <Paging
            enabled={true}
            defaultPageSize={pageSize}
            defaultPageIndex={0}
            displayMode={"full"}
            showPageSizeSelector={true}
          />
          {showPager ? (
            <Pager
              visible={true}
              allowedPageSizes={true}
              displayMode={"full"}
              showPageSizeSelector={true}
              showInfo={true}
              infoText="Có: {2} dòng"
              showNavigationButtons={true}
            />
          ) : null}
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

          {loadCol(column)}
          {allowView || allowDeleting ? (
            <Column
              type="buttons"
              visible={allowView || allowDeleting}
              caption={"Thao tác"}
            >
              <Button name="delete" />
              <Button
                onClick={(e) => viewObj(e.row.data)}
                // visible={allowView}
                // text="Chi tiết"
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
            </Column>
          ) : null}
          {loadSummary(summaryTotalItems)}
        </DataGrid>
      </div>
    );
  }
}

export default DataGridOdataControl;
