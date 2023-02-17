import {
  GET_LOAI_HD,
  GET_LOAI_NCC,
  GET_NCC,
  GET_HOP_DONG,
  GET_PGH_BV,
  GET_PACKAGE,
} from "../contants/actionTypes";
import _ from "lodash";
const initialState = {
  lstTypeSuppliers: [],
  lstSuppliers: [],
  lstTypeContracts: [],
  lstContracts: [],
  lstOrderSuppliers: [],
  lstPackages: [],
};

const HopDongReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOAI_NCC:
      return {
        ...state,
        lstTypeSuppliers: action.payload.value,
      };
    case GET_NCC:
      return {
        ...state,
        lstSuppliers: action.payload.value,
      };
    case GET_LOAI_HD:
      return {
        ...state,
        lstTypeContracts: action.payload.value,
      };
    case GET_HOP_DONG:
      return {
        ...state,
        lstContracts: action.payload.value,
      };
    case GET_PGH_BV:
      return {
        ...state,
        lstOrderSuppliers: action.payload.value,
      };
    case GET_PACKAGE:
      return {
        ...state,
        lstPackages: action.payload.value,
      };
    default:
      return state;
  }
};

export default HopDongReducers;
