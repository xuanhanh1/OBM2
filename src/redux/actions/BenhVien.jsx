import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";

export const getALLBenhViens = () => (dispatch, getState) => {
  callApi("odata/Hospitals", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_BENHVIENS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
