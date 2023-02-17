import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { Notification } from "../index";

//Đơn vị tính
export const getAllUnits = () => (dispatch, getState) => {
  callApi("odata/Units", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_DVT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createUnits = (IUnits) => (dispatch, getState) => {
  let result = callApi("odata/Units", "POST", IUnits)
    .then((res) => {
      Notification("success", "Thêm mới đơn vị tính thành công !");
      dispatch(getAllUnits());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editUnits = (IUnits) => (dispatch, getState) => {
  let result = callApi(`odata/Units?key=${IUnits.Id}`, "PUT", IUnits)
    .then((res) => {
      Notification("success", "Sửa đơn vị tính thành công !");
      dispatch(getAllUnits());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteUnits = (ID) => (dispatch, getState) => {
  callApi(`odata/Units?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa đơn vị tính thành công !");
      dispatch(getAllUnits());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa đơn vị tính thất bại !");
    });
};
//Đường dùng
export const getAllRouteOfUses = () => (dispatch, getState) => {
  callApi("odata/RouteOfUses", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_DUONG_DUNG,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createRouteOfUses = (IRouteOfUses) => (dispatch, getState) => {
  let result = callApi("odata/RouteOfUses", "POST", IRouteOfUses)
    .then((res) => {
      Notification("success", "Thêm mới đường dùng thành công !");
      dispatch(getAllRouteOfUses());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editRouteOfUses = (IRouteOfUses) => (dispatch, getState) => {
  let result = callApi(
    `odata/RouteOfUses?key=${IRouteOfUses.Id}`,
    "PUT",
    IRouteOfUses
  )
    .then((res) => {
      Notification("success", "Sửa đường dùng thành công !");
      dispatch(getAllRouteOfUses());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteRouteOfUses = (ID) => (dispatch, getState) => {
  callApi(`odata/RouteOfUses?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa đường dùng thành công !");
      dispatch(getAllRouteOfUses());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa đường dùng thất bại !");
    });
};
//loại thuốc/vật tư
export const getAllTypeMedicalSupplies = () => (dispatch, getState) => {
  callApi("odata/TypeMedicalSupplies", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_LOAI_THUOC_VATTU,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createTypeMedicalSupplies =
  (ITypeMedicalSupplies) => (dispatch, getState) => {
    let result = callApi(
      "odata/TypeMedicalSupplies",
      "POST",
      ITypeMedicalSupplies
    )
      .then((res) => {
        Notification("success", "Thêm mới loại thuốc/vật tư thành công !");
        dispatch(getAllTypeMedicalSupplies());
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editTypeMedicalSupplies =
  (ITypeMedicalSupplies) => (dispatch, getState) => {
    let result = callApi(
      `odata/TypeMedicalSupplies?key=${ITypeMedicalSupplies.Id}`,
      "PUT",
      ITypeMedicalSupplies
    )
      .then((res) => {
        Notification("success", "Sửa loại thuốc/vật tư thành công !");
        dispatch(getAllTypeMedicalSupplies());
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const deleteTypeMedicalSupplies = (ID) => (dispatch, getState) => {
  callApi(`odata/TypeMedicalSupplies?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa loại thuốc/vật tư thành công !");
      dispatch(getAllTypeMedicalSupplies());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa loại thuốc/vật tư thất bại !");
    });
};
//Loại của thuốc/ vật tư
export const createTypeMedicalSuppliesDetails =
  (ITypeMedicalSuppliesDetails) => (dispatch, getState) => {
    let result = callApi(
      "odata/TypeMedicalSuppliesDetails",
      "POST",
      ITypeMedicalSuppliesDetails
    )
      .then((res) => {
        Notification("success", "Thêm mới loại thuốc/vật tư thành công !");
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editTypeMedicalSuppliesDetails =
  (ITypeMedicalSuppliesDetails) => (dispatch, getState) => {
    let result = callApi(
      `odata/TypeMedicalSuppliesDetails?key=${ITypeMedicalSuppliesDetails.Id}`,
      "PUT",
      ITypeMedicalSuppliesDetails
    )
      .then((res) => {
        Notification("success", "Sửa loại thuốc/vật tư thành công !");
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const deleteTypeMedicalSuppliesDetails =
  (ID) => (dispatch, getState) => {
    let result = callApi(`odata/TypeMedicalSuppliesDetails?key=${ID}`, "DELETE")
      .then((res) => {
        Notification("success", "Xóa loại thuốc/vật tư thành công !");
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", "Xóa loại thuốc/vật tư thất bại !");
        return false;
      });
    return result;
  };
//thuốc/vật tư
export const getAllMedicalSupplies = () => (dispatch, getState) => {
  callApi("odata/MedicalSupplies", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_THUOC_VT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createMedicalSupplies =
  (IMedicalSupplies) => (dispatch, getState) => {
    let result = callApi("odata/MedicalSupplies", "POST", IMedicalSupplies)
      .then((res) => {
        Notification("success", "Thêm mới thuốc/vật tư thành công !");
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editMedicalSupplies =
  (IMedicalSupplies) => (dispatch, getState) => {
    let result = callApi(
      `odata/MedicalSupplies?key=${IMedicalSupplies.Id}`,
      "PUT",
      IMedicalSupplies
    )
      .then((res) => {
        Notification("success", "Sửa thuốc/vật tư thành công !");
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const deleteMedicalSupplies = (ID) => (dispatch, getState) => {
  callApi(`odata/MedicalSupplies?key=${ID}`, "DELETE")
    .then((res) => {
      dispatch(getAllMedicalSupplies());
      Notification("success", "Xóa thuốc/vật tư thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa thuốc/vật tư thất bại !");
    });
};
