import { GET_ALL_BENHVIENS } from "../contants/actionTypes";

const initialState = {
  lstBenhViens: {},
};

const BenhVienReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BENHVIENS:
      return {
        ...state,
        lstBenhViens: action.payload.value,
      };
    default:
      return state;
  }
};

export default BenhVienReducers;
