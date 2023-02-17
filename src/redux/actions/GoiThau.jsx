import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";

// export const getAllMenus = () => (dispatch, getState) => {
//   callApi("odata/menus/gettreecntt?$expand=Children", "GET")
//     .then((res) => {
//       dispatch({
//         type: types.GET_ALL_MENU,
//         payload: res.data,
//       });
//     })
//     .catch((err) => {
//       console.log(err.response);
//     });
// };
export const getAllThuocs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreethuoc?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_THUOC,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getAllVTTTs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreevttt?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_VTTT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getAllVTKTCs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreevtktc?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_VTKTC,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getAllHCs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreehc?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_HC,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getAllHQTs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreehqt?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_HQT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const getAllCNTTs = () => (dispatch, getState) => {
  callApi("odata/menus/gettreecntt?$expand=Children", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_CNTT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const getAllBidDocument = () => (dispatch, getState) => {
  callApi(`odata/BiddingDocuments/Select`, "GET")
    .then((res) => {
      dispatch({
        type: types.GET_BID_DOCUMENT,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
export const getAllBidder = () => (dispatch, getState) => {
  callApi(`odata/Bidders`, "GET")
    .then((res) => {
      dispatch({
        type: types.GET_ALL_BIDER,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

// export const UpdateBids = (data) =>(dispatch, getState) => {
//   callApi(``)
// }
