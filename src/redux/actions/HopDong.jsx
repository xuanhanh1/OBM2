import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { Notification } from "../index";
import _ from "lodash";
import moment from "moment";
//loại nhà cung cấp
export const getAllTypeSuppliers = () => (dispatch, getState) => {
  callApi("odata/TypeSuppliers", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_LOAI_NCC,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createTypeSuppliers = (ITypeSuppliers) => (dispatch, getState) => {
  let result = callApi("odata/TypeSuppliers", "POST", ITypeSuppliers)
    .then((res) => {
      Notification("success", "Thêm mới loại nhà cung cấp thành công !");
      dispatch(getAllTypeSuppliers());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editTypeSuppliers = (ITypeSuppliers) => (dispatch, getState) => {
  let result = callApi(
    `odata/TypeSuppliers?key=${ITypeSuppliers.Id}`,
    "PUT",
    ITypeSuppliers
  )
    .then((res) => {
      Notification("success", "Sửa loại nhà cung cấp thành công !");
      dispatch(getAllTypeSuppliers());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteTypeSuppliers = (ID) => (dispatch, getState) => {
  callApi(`odata/TypeSuppliers?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa loại nhà cung cấp thành công !");
      dispatch(getAllTypeSuppliers());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa loại nhà cung cấp thất bại !");
    });
};

//nhà cung cấp
export const getAllSuppliers = () => (dispatch, getState) => {
  callApi("odata/Suppliers", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_NCC,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const createSuppliers = (ISuppliers) => (dispatch, getState) => {
  let result = callApi("odata/Suppliers", "POST", ISuppliers)
    .then((res) => {
      Notification("success", "Thêm mới nhà cung cấp thành công !");
      dispatch(getAllSuppliers());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editSuppliers = (ISuppliers) => (dispatch, getState) => {
  let result = callApi(
    `odata/Suppliers?key=${ISuppliers.Id}`,
    "PUT",
    ISuppliers
  )
    .then((res) => {
      Notification("success", "Sửa nhà cung cấp thành công !");
      //dispatch(getAllSuppliers());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteSuppliers = (ID) => (dispatch, getState) => {
  callApi(`odata/Suppliers?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa nhà cung cấp thành công !");
      dispatch(getAllSuppliers());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa nhà cung cấp thất bại !");
    });
};

//loại nhà cung cấp
export const getAllTypeContracts = () => (dispatch, getState) => {
  callApi("odata/TypeContracts", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_LOAI_HD,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createTypeContracts = (ITypeContracts) => (dispatch, getState) => {
  let result = callApi("odata/TypeContracts", "POST", ITypeContracts)
    .then((res) => {
      Notification("success", "Thêm mới loại hợp đồng thành công !");
      dispatch(getAllTypeContracts());
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editTypeContracts = (ITypeContracts) => (dispatch, getState) => {
  let result = callApi(
    `odata/TypeContracts?key=${ITypeContracts.Id}`,
    "PUT",
    ITypeContracts
  )
    .then((res) => {
      Notification("success", "Sửa loại hợp đồng thành công !");
      dispatch(getAllTypeContracts());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteTypeContracts = (ID) => (dispatch, getState) => {
  callApi(`odata/TypeContracts?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa loại hợp đồng thành công !");
      dispatch(getAllTypeContracts());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa loại hợp đồng thất bại !");
    });
};
//nhà cung cấp
export const getAllContracts = () => (dispatch, getState) => {
  callApi("odata/Contracts", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_HOP_DONG,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const uploadFile = (ILISTFILE) => (dispatch, getState) => {
  let result = callApi(
    `api/FileUpload/SafeUpload_Contract?contract_id=${ILISTFILE.ContractId}`,
    "POST",
    ILISTFILE.fd,
    "multipart/form-data"
  )
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};

export const uploadFilePhuLuc = (ILISTFILE) => (dispatch, getState) => {
  let result = callApi(
    `api/FileUpload/SafeUpload_ContractAnnex?contractannex_id=${ILISTFILE.ContractId}`,
    "POST",
    ILISTFILE.fd,
    "multipart/form-data"
  )
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
  return result;
};
export const createContracts = (IContracts) => (dispatch, getState) => {
  let result = callApi("odata/Contracts", "POST", IContracts)
    .then((res) => {
      Notification("success", "Thêm mới hợp đồng thành công !");
      //dispatch(getAllContracts());
      if (!_.isEmpty(IContracts.lstFile)) {
        let formData = new FormData();
        _.map(IContracts.lstFile, (item) => {
          formData.append("files", item);
        });
        dispatch(
          uploadFile({
            ContractId: res.data.Id,
            fd: formData,
          })
        );
      }
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editContracts = (IContracts) => (dispatch, getState) => {
  console.log(IContracts.Id);
  let result = callApi(
    `odata/Contracts?key=${IContracts.Id}`,
    "PUT",
    IContracts
  )
    .then((res) => {
      Notification("success", "Sửa hợp đồng thành công !");
      dispatch(getAllContracts());
      if (!_.isEmpty(IContracts.lstFile)) {
        let formData = new FormData();
        _.map(IContracts.lstFile, (item) => {
          formData.append("files", item);
        });
        dispatch(
          uploadFile({
            ContractId: IContracts.Id,
            fd: formData,
          })
        );
      }
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data?.Errors[0]);
      return false;
    });
  return result;
};

export const deleteContracts = (ID) => (dispatch, getState) => {
  callApi(`odata/Contracts?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa hợp đồng thành công !");
      dispatch(getAllContracts());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa hợp đồng thất bại !");
    });
};
//phiếu gọi hàng
export const getAllOrderSuppliers = () => (dispatch, getState) => {
  callApi("odata/OrderSuppliers", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_PGH_BV,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};
export const createOrderSuppliers =
  (IOrderSuppliers) => (dispatch, getState) => {
    let result = callApi("odata/OrderSuppliers", "POST", IOrderSuppliers)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editOrderSuppliers = (IOrderSuppliers) => (dispatch, getState) => {
  console.log("editOrderSuppliers", IOrderSuppliers);
  let result = callApi(
    `odata/OrderSuppliers?key=${IOrderSuppliers.Id}`,
    "PUT",
    IOrderSuppliers
  )
    .then((res) => {
      Notification("success", "Xác nhận phiếu gọi hàng thành công !");
      return true;
    })
    .catch((err) => {
      console.log(err.response);
      Notification("error", err.response.data?.Errors[0]);
      return false;
    });
  return result;
};

export const editStatusOrderSuppliers =
  (IOrderSuppliers) => (dispatch, getState) => {
    let result = callApi(
      `odata/OrderSuppliers/UpdateStatusRange`,
      "PUT",
      IOrderSuppliers
    )
      .then((res) => {
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const deleteOrderSuppliers = (ID) => (dispatch, getState) => {
  callApi(`odata/OrderSuppliers?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa phiếu gọi hàng thành công !");
      dispatch(getAllOrderSuppliers());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa phiếu gọi hàng thất bại !");
    });
};
//Quản lý gói thầu
export const getAllPackages = () => (dispatch, getState) => {
  callApi("odata/Packages", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_PACKAGE,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const createPackages = (IPackages) => (dispatch, getState) => {
  let result = callApi("odata/Packages", "POST", IPackages)
    .then((res) => {
      console.log(res);
      Notification("success", "Thêm mới gói thầu thành công !");
      //dispatch(getAllPackages());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editPackages = (IPackages) => (dispatch, getState) => {
  let result = callApi(`odata/Packages?key=${IPackages.Id}`, "PUT", IPackages)
    .then((res) => {
      Notification("success", "Sửa gói thầu thành công !");
      dispatch(getAllPackages());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deletePackages = (ID) => (dispatch, getState) => {
  let result = callApi(`odata/Packages?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa gói thầu thành công !");
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa gói thầu thất bại !");
      return false;
    });
  return result;
};

//Phiếu yêu cầu gọi hàng
export const getAllRequestMedicalSupplies = () => (dispatch, getState) => {
  callApi("odata/RequestMedicalSupplies", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_REQUEST_MEDICAL_SUPPLIES,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const createRequestMedicalSupplies =
  (IRequestMedicalSupplies) => (dispatch, getState) => {
    let result = callApi(
      "odata/RequestMedicalSupplies",
      "POST",
      IRequestMedicalSupplies
    )
      .then((res) => {
        dispatch(
          createOrderSuppliers(
            _.map(
              _.groupBy(IRequestMedicalSupplies.isLstPickVatTu, "contract_id"),
              (item, key) => {
                return {
                  contract_id: key,
                  supplier_id: item[0].supplier_id,
                  stafforder_id: IRequestMedicalSupplies.stafforder_id,
                  name: IRequestMedicalSupplies.name,
                  note: IRequestMedicalSupplies.note,
                  order_date: moment().format(),
                  estimate_delivery_date:
                    IRequestMedicalSupplies.estimate_delivery_date,
                  status_name: "Tạo mới phiếu gọi hàng",
                  requestmedicalsupplies_id: res.data.Id,
                  order_details: _.map(item, (x) => x),
                  deliverytime_id: IRequestMedicalSupplies.deliverytime_id,
                };
              }
            )
          )
        );
        Notification("success", "Thêm mới phiếu yêu cầu gọi hàng thành công !");
        //dispatch(getAllRequestMedicalSupplies());
        return true;
      })
      .catch((err) => {
        Notification("error", err.response?.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editRequestMedicalSupplies =
  (IRequestMedicalSupplies) => (dispatch, getState) => {
    let result = callApi(
      `odata/RequestMedicalSupplies?key=${IRequestMedicalSupplies.Id}`,
      "PUT",
      IRequestMedicalSupplies
    )
      .then((res) => {
        Notification("success", "Sửa phiếu yêu cầu gọi hàng thành công !");
        dispatch(getAllRequestMedicalSupplies());
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const deleteRequestMedicalSupplies = (ID) => (dispatch, getState) => {
  callApi(`odata/RequestMedicalSupplies?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa phiếu yêu cầu gọi hàng thành công !");
      dispatch(getAllRequestMedicalSupplies());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa phiếu yêu cầu gọi hàng thất bại !");
    });
};

//Phiếu giao hàng

export const createDeliverySuppliers =
  (IDeliverySuppliers) => (dispatch, getState) => {
    console.log(IDeliverySuppliers);
    let result = callApi("odata/DeliverySuppliers", "POST", IDeliverySuppliers)
      .then((res) => {
        Notification("success", "Thêm mới phiếu giao hàng thành công !");
        return true;
      })
      .catch((err) => {
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };

export const editDeliverySuppliers =
  (IDeliverySuppliers) => (dispatch, getState) => {
    let result = callApi(
      `odata/DeliverySuppliers?key=${IDeliverySuppliers.Id}`,
      "PUT",
      IDeliverySuppliers
    )
      .then((res) => {
        return true;
      })
      .catch((err) => {
        console.log(err.response.data);
        Notification("error", err.response.data.Errors[0]);
        return false;
      });
    return result;
  };
//Delivery Time
export const createDeliveryTimes = (IDeliveryTimes) => (dispatch, getState) => {
  let result = callApi("odata/DeliveryTimes", "POST", IDeliveryTimes)
    .then((res) => {
      Notification("success", "Thêm mới khung giờ thành công!");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const editDeliveryTimes = (IDeliveryTimes) => (dispatch, getState) => {
  let result = callApi(
    `odata/DeliveryTimes?key=${IDeliveryTimes.Id}`,
    "PUT",
    IDeliveryTimes
  )
    .then((res) => {
      Notification("success", "Sửa khung giờ thành công!");
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};
export const deleteDeliveryTimes = (ID) => (dispatch, getState) => {
  let result = callApi(`odata/DeliveryTimes?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa khung giờ thành công !");
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};
