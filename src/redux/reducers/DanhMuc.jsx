import {
  GET_KHOAPHONG,
  GET_NHANVIEN,
  GET_CHUCVU,
  GET_NHANVIEN_BY_KHOAPHONGID,
} from "../contants/actionTypes";

const initialState = {
  lstKhoaPhongs: [],
  lstDonViNhanKP: [],
  lstNhanViens: [],
  lstPositions: [],
  lstNhanViensByKhoaPhong: [],
};

const DoanhMucReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_KHOAPHONG:
      return {
        ...state,
        lstKhoaPhongs: action.payload,
      };
    case GET_NHANVIEN:
      //bỏ tk admin
      const newData = action.payload.filter(
        (item) => item.Id !== "0af43c90-6237-4cd7-95d4-adbb0085c9cd"
      );
      return {
        ...state,
        lstNhanViens: newData,
      };
    case GET_CHUCVU:
      return {
        ...state,
        lstPositions: action.payload,
      };

    case GET_NHANVIEN_BY_KHOAPHONGID:
      return {
        ...state,
        lstNhanViensByKhoaPhong: action.payload,
      };
    default:
      return state;
  }
};

export default DoanhMucReducers;
