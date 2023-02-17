import {
  GET_DVT,
  GET_DUONG_DUNG,
  GET_LOAI_THUOC_VATTU,
  GET_THUOC_VT,
} from "../contants/actionTypes";

const initialState = {
  lstUnits: [],
  lstRouteOfUses: [],
  lstTypeMedicalSupplies: [],
  lstMedicalSupplies: [],
};

const ThuocVatTuReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_DVT:
      return {
        ...state,
        lstUnits: action.payload.value,
      };
    case GET_DUONG_DUNG:
      return {
        ...state,
        lstRouteOfUses: action.payload.value,
      };
    case GET_LOAI_THUOC_VATTU:
      return {
        ...state,
        lstTypeMedicalSupplies: action.payload.value,
      };
    case GET_THUOC_VT:
      return {
        ...state,
        lstMedicalSupplies: action.payload.value,
      };
    default:
      return state;
  }
};

export default ThuocVatTuReducers;
