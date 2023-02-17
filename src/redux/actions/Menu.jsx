import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";

export const getAllMenus = () => (dispatch, getState) => {
  callApi("odata/Menus/GetAll?$expand=Children", "GET")
    .then((res) => {
      console.log("res get all menu", res.data);
      dispatch({
        type: types.GET_ALL_MENU,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getMenusByUser = () => (dispatch, getState) => {
  callApi("odata/Menus?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_MENU_BY_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const setCurrentMenu = (data) => (dispatch, getState) => {
  localStorage.setItem("currentMenu", data);
  dispatch({
    type: types.SET_CURRENT_MENU,
    payload: data,
  });
};
