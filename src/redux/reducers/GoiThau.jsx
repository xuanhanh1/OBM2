import {
  GET_ALL_MENU,
  GET_ALL_THUOC,
  GET_ALL_VTTT,
  GET_ALL_VTKTC,
  GET_ALL_HC,
  GET_ALL_HQT,
  GET_ALL_CNTT,
  GET_MENU_BY_USER,
  GET_BID_DOCUMENT,
  GET_ALL_BIDER,
} from "../contants/actionTypes";
import _ from "lodash";
const initialState = {
  lstMenu: [],
  lstAllMenu: [],
  lstAllThuoc: [],
  lstAllVTTT: [],
  lstAllVTKTC: [],
  lstAllHC: [],
  lstAllHQT: [],
  lstAllCNTT: [],
  lstChildMenu: [],
  lstBidDocument: [],
  lstBidder: [],
};

const GoiThauReducers = (state = initialState, action) => {
  switch (action.type) {
    // case GET_ALL_MENU:
    //   _.map(action.payload.value, (item) => {
    //     item.items = item.CHILDREN;
    //     item.expanded = true;
    //   });
    //   return {
    //     ...state,
    //     lstAllMenu: action.payload.value,
    //   };
    case GET_ALL_THUOC:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllThuoc: action.payload.value,
      };
    case GET_ALL_VTTT:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllVTTT: action.payload.value,
      };
    case GET_ALL_VTKTC:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllVTKTC: action.payload.value,
      };
    case GET_ALL_HC:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllHC: action.payload.value,
      };
    case GET_ALL_HQT:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });
      return {
        ...state,
        lstAllHQT: action.payload.value,
      };
    case GET_ALL_CNTT:
      _.map(action.payload.value, (item) => {
        item.items = item.CHILDREN;
        item.expanded = true;
      });

    // dau thau
    case GET_BID_DOCUMENT:
      return {
        ...state,
        lstBidDocument: action.payload,
      };
    case GET_ALL_BIDER:
      // console.log("action.payload", action.payload);
      return {
        ...state,
        lstBidder: action.payload,
      };
    default:
      return state;
  }
};

export default GoiThauReducers;
