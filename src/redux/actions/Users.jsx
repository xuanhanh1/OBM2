import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { getAllMenus } from "./Menu";
import { Notification, history } from "../index";
import { createNhanViens, createStaffOfSupplier } from "./DanhMuc";
import { updUserRoles } from "./QuanTri";
import _ from "lodash";
export const actLogin = (IUser) => async (dispatch, getState) => {
  let result = await callApi("api/AuthManagement/Login", "POST", IUser)
    .then((res) => {
      if (res.data.result) {
        console.log("res", res);
        window.localStorage.setItem("token", JSON.stringify(res.data.token));
        window.localStorage.setItem("infoNV", JSON.stringify(res.data.staff));
        Notification("success", "Đăng nhập thành công !");
        dispatch(getAllMenus());
        dispatch({
          type: types.LOGIN,
          payload: res.data,
        });
        return true;
      } else {
        const data = res.data;
        console.log("data", data);
        Notification("error", data.Errors);
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return result;
};

export const actRegister = (IUser) => async (dispatch, getState) => {
  let result = await callApi("api/AuthManagement/Register", "POST", IUser)
    .then((res) => {
      if (res.data.result) {
        dispatch(
          updUserRoles({ Id: res.data.userId, lstRoles: IUser.lstRoles })
        );
        let result = dispatch(
          createNhanViens({ ...IUser, user_id: res.data.userId })
        );
        return result;
      } else {
        const data = res.data;
        Notification("error", data.errors[0]);
        return false;
      }
    })
    .catch((err) => {
      if (err.response?.data) {
        let obj = err.response?.data;
        if (_.isUndefined(obj.errors)) {
          Notification("error", obj.errors[0]);
        } else {
          Notification("error", obj[Object.keys(obj)[0]]);
        }
      }
      return false;
    });
  return result;
};

export const actRegister_Supplier = (IUser) => async (dispatch, getState) => {
  let result = await callApi("api/AuthManagement/Register", "POST", IUser)
    .then((res) => {
      if (res.data.Result) {
        let result = dispatch(
          createStaffOfSupplier({
            ...IUser,
            TAIKHOANID: res.data.TaiKhoanId,
            SUPPLIER_ID: IUser.SupplierId,
          })
        );
        return result;
      } else {
        const data = res.data;
        Notification("error", data.Errors);
        return false;
      }
    })
    .catch((err) => {
      if (err.response?.data) {
        let obj = err.response?.data;
        if (_.isUndefined(obj.errors)) {
          Notification("error", obj.Errors[0]);
        } else {
          Notification("error", obj[Object.keys(obj)[0]]);
        }
      }
      return false;
    });
  return result;
};

export const setStatusLoginWithToken = (status, token, isNV) => {
  return {
    type: types.LOGIN,
    payload: { Result: status, Token: token, NhanVien: isNV },
  };
};

export const actLogout = () => {
  return {
    type: types.DESTROY_SESSION,
  };
};

//Thay đổi ngôn ngữ ứng dụng
export const changeLanguage = (language) => {
  return {
    type: types.CHANGE_LANGUAGE,
    language,
  };
};

export const connectionSignalR = (connection) => {
  return {
    type: types.CONNECTION_SIGNALR,
    connection,
  };
};
