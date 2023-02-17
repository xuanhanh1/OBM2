import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { Notification } from "../index";

export const getAllRoles = () => (dispatch, getState) => {
  callApi("odata/Roles?$expand=menus", "GET")
    .then((res) => {
      console.log(res);
      dispatch({
        type: types.GET_ALL_ROLEs,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const createRoles = (IRole) => (dispatch, getState) => {
  console.log(IRole);
  let result = callApi("odata/Roles", "POST", IRole)
    .then((res) => {
      return dispatch(
        createMenuInRoles({
          lstMenus: IRole.LstMenus,
          Id: res.data.Id,
          type: 1,
        })
      );
    })
    .catch((err) => {
      console.log(err.response);
      return false;
    });
  return result;
};

export const editRoles = (IRole) => (dispatch, getState) => {
  let result = callApi(`odata/Roles?key=${IRole.Id}`, "PUT", IRole)
    .then((res) => {
      return dispatch(
        createMenuInRoles({ lstMenus: IRole.LstMenus, Id: IRole.Id, type: 2 })
      );
    })
    .catch((err) => {
      console.log(err.response);
      return false;
    });
  return result;
};

export const updUserRoles = (IUser) => (dispatch, getState) => {
  callApi(
    `odata/Roles/UpdateUserRole?UserId=${IUser.Id}`,
    "POST",
    IUser.lstRoles
  )
    .then((res) => {})
    .catch((err) => {});
};

export const createMenuInRoles = (IMenuRole) => (dispatch, getState) => {
  let result = callApi(
    `odata/Roles/AddMenusInRole?RoleId=${IMenuRole.Id}`,
    "POST",
    IMenuRole.lstMenus
  )
    .then((res) => {
      if (IMenuRole.type === 1) {
        Notification("success", "Thêm mới quyền người dùng thành công");
      } else {
        Notification("success", "Sửa quyền người dùng thành công");
      }
      dispatch(getAllRoles());
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      return false;
    });
  return result;
};
