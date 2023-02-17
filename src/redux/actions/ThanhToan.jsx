import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { Notification } from "../index";

//hóa đơn
export const getAllBills = () => (dispatch, getState) => {
  callApi("odata/Bills", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_BILL,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createBills = (IBills) => (dispatch, getState) => {
  let result = callApi("odata/Bills", "POST", IBills)
    .then((res) => {
      Notification("success", "Thêm mới hóa đơn thành công !");
      //dispatch(getAllBills());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data?.Errors[0]);
      return false;
    });
  return result;
};

export const editBills = (IBills) => (dispatch, getState) => {
  let result = callApi(`odata/Bills?key=${IBills.Id}`, "PUT", IBills)
    .then((res) => {
      Notification("success", "Sửa hóa đơn thành công !");
      dispatch(getAllBills());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editStatusBills = (IBills) => (dispatch, getState) => {
  let result = callApi(`odata/Bills/UpdateStatusRange`, "PUT", IBills)
    .then((res) => {
      dispatch(getAllBills());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteBills = (ID) => (dispatch, getState) => {
  callApi(`odata/Bills?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa hóa đơn thành công !");
      dispatch(getAllBills());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa hóa đơn thất bại !");
    });
};

//Công nợ
export const getAllCheckouts = () => (dispatch, getState) => {
  callApi("odata/Checkouts", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_BILL,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const createCheckouts = (ICheckouts) => (dispatch, getState) => {
  let result = callApi("odata/Checkouts", "POST", ICheckouts)
    .then((res) => {
      Notification("success", "Thêm mới hóa đơn thành công !");
      dispatch(getAllCheckouts());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editCheckouts = (ICheckouts) => (dispatch, getState) => {
  let result = callApi(
    `odata/Checkouts?key=${ICheckouts.Id}`,
    "PUT",
    ICheckouts
  )
    .then((res) => {
      Notification("success", "Xác nhận hóa đơn thành công !");
      dispatch(getAllCheckouts());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteCheckouts = (ID) => (dispatch, getState) => {
  callApi(`odata/Checkouts?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa hóa đơn thành công !");
      dispatch(getAllCheckouts());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa hóa đơn thất bại !");
    });
};

//Đề nghị thanh toán
export const getAllRequestPayments = () => (dispatch, getState) => {
  callApi("odata/RequestPayments", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_REQUEST_PAYMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const uploadFileRequestPayments =
  (ILISTFILE) => (dispatch, getState) => {
    let result = callApi(
      `api/FileUpload/SafeUpload_RequestPayment?requestpayment_id=${ILISTFILE.RequestPaymentId}`,
      "POST",
      ILISTFILE.fd,
      "multipart/form-data"
    )
      .then((res) => {
        Notification("success", "Upload file chứng từ thành công");
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        return false;
      });
    return result;
  };

export const createRequestPayments =
  (IRequestPayments) => (dispatch, getState) => {
    let result = callApi("odata/RequestPayments", "POST", IRequestPayments)
      .then((res) => {
        Notification("success", "Thêm mới đề nghị thanh toán thành công !");
        dispatch(getAllRequestPayments());
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const createRangeRequestPayments =
  (ILstRequestPayments) => (dispatch, getState) => {
    let result = callApi(
      "odata/RequestPayments/AddRange",
      "POST",
      ILstRequestPayments
    )
      .then((res) => {
        Notification("success", "Thêm mới đề nghị thanh toán thành công !");
        dispatch(getAllRequestPayments());
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editRequestPayments =
  (IRequestPayments) => (dispatch, getState) => {
    let result = callApi(
      `odata/RequestPayments?key=${IRequestPayments.Id}`,
      "PUT",
      IRequestPayments
    )
      .then((res) => {
        Notification("success", "Sửa đề nghị thanh toán thành công !");
        dispatch(getAllRequestPayments());
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };
export const editStatusRequestPayments =
  (IRequestPayments) => (dispatch, getState) => {
    let result = callApi(
      `odata/RequestPayments/UpdateStatusRange`,
      "PUT",
      IRequestPayments
    )
      .then((res) => {
        dispatch(getAllRequestPayments());
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };
export const deleteRequestPayments = (ID) => (dispatch, getState) => {
  callApi(`odata/RequestPayments?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa đề nghị thanh toán thành công !");
      dispatch(getAllRequestPayments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa đề nghị thanh toán thất bại !");
    });
};
