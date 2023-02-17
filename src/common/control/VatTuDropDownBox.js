import React from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  SearchPanel,
} from "devextreme-react/data-grid";
import DropDownBox from "devextreme-react/drop-down-box";
import List from "devextreme-react/list";
import SelectBox from "devextreme-react/select-box";
import _ from "lodash";
import "./index.css";

export default class VatTuDropDownBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.data.value,
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  onSelectionChanged(selectionChangedArgs) {
    setTimeout(() => {
      if (selectionChangedArgs.component._changedValue) {
        if (!_.isEmpty(selectionChangedArgs.selectedItem)) {
          this.setState({
            currentValue: selectionChangedArgs.selectedItem,
          });
          this.props.data.setValue(this.state.currentValue);
        }
      }
    }, 100);
  }

  editBoxValueChanged = (component) => {
    const { dataSource } = this.props.data.column.lookup;
    let currentItem = _.filter(
      dataSource,
      (x) => x.Id === component.event.target.value
    );
    if (!_.isEmpty(currentItem)) {
      this.setState({
        currentValue: currentItem[0],
      });
      this.props.data.setValue(this.state.currentValue);
    }
  };
  render() {
    const { dataSource, valueExpr, displayExpr, render, idFilterArray } =
      this.props.data.column.lookup;
    return (
      <SelectBox
        dataSource={{
          store: dataSource,
          paginate: true,
        }}
        placeholder="Selected"
        searchMode="contains"
        searchExpr={["MA_VT", "TEN_VT"]}
        searchEnabled={true}
        valueExpr={valueExpr}
        displayExpr={displayExpr}
        itemRender={render}
        onSelectionChanged={this.onSelectionChanged}
        paginate={true}
        onInput={this.editBoxValueChanged}
      ></SelectBox>
    );
  }
}
