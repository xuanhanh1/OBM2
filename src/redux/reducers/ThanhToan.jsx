import { GET_BILL, GET_REQUEST_PAYMENT } from "../contants/actionTypes";
import _ from "lodash";
const initialState = {
  lstBills: [],
  lstRequestPayments: [],
};

const ThanhToanReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILL:
      return {
        ...state,
        lstBills: action.payload.value,
      };
    case GET_REQUEST_PAYMENT:
      return {
        ...state,
        lstRequestPayments: action.payload.value,
      };
    default:
      return state;
  }
};

export default ThanhToanReducers;
