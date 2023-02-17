import { GET_ALL_ROLEs } from "../contants/actionTypes";
import _ from "lodash";
const initialState = {
  lstRoles: {},
};

const QuanTriReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ROLEs:
      _.map(action.payload.value, (item) => {
        item.label = item.value = item.NAME;
      });
      return {
        ...state,
        lstRoles: action.payload.value,
      };
    default:
      return state;
  }
};

export default QuanTriReducers;
