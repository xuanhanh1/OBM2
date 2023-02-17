import { combineReducers } from "redux";
import * as types from "../contants/actionTypes";
import BenhVienReducers from "./BenhVien";
import UsersReducers from "./Users";
import MenuReducers from "./Menu";
import DanhMucReducers from "./DanhMuc";
import QuanTriReducers from "./QuanTri";
import ThuocVatTuReducers from "./ThuocVatTu";
import HopDongReducers from "./HopDong";
import GoiThauReducers from "./GoiThau";
import ThanhToanReducers from "./ThanhToan";
const appReducer = combineReducers({
  BenhVienReducers,
  UsersReducers,
  MenuReducers,
  DanhMucReducers,
  QuanTriReducers,
  ThuocVatTuReducers,
  HopDongReducers,
  ThanhToanReducers,
  GoiThauReducers,
});

const rootReducer = (state, action) => {
  //Clear all data in redux store to initial.
  if (action.type === types.DESTROY_SESSION) state = undefined;
  return appReducer(state, action);
};

export default rootReducer;
