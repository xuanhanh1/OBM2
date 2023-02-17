import * as types from "../contants/actionTypes";
import callApi from "../../config/configApi";
import { Notification } from "../index";
import _ from "lodash";
//Khoa phòng
export const getALLDepartments =
  (rsData = false) =>
  (dispatch, getState) => {
    const lstKhoaPhong = getState().DanhMucReducers.lstDepartments;
    if (_.isEmpty(lstKhoaPhong) || rsData) {
      callApi("odata/Departments", "GET")
        .then((res) => {
          dispatch({
            type: types.GET_KHOAPHONG,
            payload: res.data.value,
          });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

export const createDepartments = (IDepartments) => (dispatch, getState) => {
  let result = callApi("odata/Departments", "POST", IDepartments)
    .then((res) => {
      Notification("success", "Thêm mới khoa phòng thành công !");
      dispatch(getALLDepartments());
      if (!_.isEmpty(IDepartments.lstTypes)) {
        createTypesDepartment({
          Id: res.value.Id,
          LstTypes: IDepartments.lstTypes,
        });
      }
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};
export const createTypesDepartment = (ILstTypes) => (dispatch, getState) => {
  let result = callApi(
    `odata/TypeMedicalSupplies/AddTypeDepartment?DepartmentId=${ILstTypes.Id}`,
    "POST",
    ILstTypes.LstTypes
  )
    .then((res) => {
      Notification("success", "Cập nhật loại khoa/phòng thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};
export const editDepartments = (IDepartments) => (dispatch, getState) => {
  callApi(`odata/Departments?key=${IDepartments.Id}`, "PUT", IDepartments)
    .then((res) => {
      Notification("success", "Sửa khoa phòng thành công !");
      dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
    });
};

export const deleteDepartments = (ID) => (dispatch, getState) => {
  callApi(`odata/Departments?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa khoa phòng thành công !");
      dispatch(getALLDepartments());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa khoa phòng thất bại !");
    });
};
//Nhân viên
export const getALLNhanViens = () => (dispatch, getState) => {
  callApi("odata/Staffs", "GET")
    .then((res) => {
      dispatch(getALLDepartments());
      dispatch(getALLPositions());
      dispatch({
        type: types.GET_NHANVIEN,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//get nhân viên trong danh mục => trừ nv của tài khoản đang đăng nhập ra
export const getALLNhanVienInDanhMuc =
  (NhanVien_Id) => (dispatch, getState) => {
    callApi(`odata/Staffs?$filter=Id ne ${NhanVien_Id}`, "GET")
      .then((res) => {
        dispatch(getALLDepartments());
        dispatch(getALLPositions());
        dispatch({
          type: types.GET_NHANVIEN,
          payload: res.data.value,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
export const createNhanViens = (INhanViens) => (dispatch, getState) => {
  let result = callApi("odata/Staffs", "POST", INhanViens)
    .then((res) => {
      Notification("success", "Thêm mới nhân viên thành công !");
      return true;
    })
    .catch((err) => {
      if (err.response?.data) {
        Notification("error", err.response?.data.Errors);
      }
      return false;
    });
  return result;
};

export const editNhanViens = (INhanViens) => (dispatch, getState) => {
  callApi(`odata/Staffs?key=${INhanViens.id}`, "PUT", INhanViens)
    .then((res) => {
      Notification("success", "Sửa nhân viên thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Sửa nhân viên thất bại !");
    });
};

export const deleteNhanViens = (ID) => (dispatch, getState) => {
  callApi(`odata/Staffs?key=${ID}`, "DELETE")
    .then((res) => {
      dispatch(getALLNhanVienInDanhMuc(ID));
      Notification("success", "Xóa nhân viên thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa nhân viên thất bại !");
    });
};
export const createStaffOfSupplier = (INhanViens) => (dispatch, getState) => {
  let result = callApi("odata/Staffs/AddStaffOfSupplier", "POST", INhanViens)
    .then((res) => {
      Notification("success", "Thêm mới nhân viên thành công !");
      return true;
    })
    .catch((err) => {
      if (err.response?.data) {
        Notification("error", err.response?.data.Errors);
      }
      return false;
    });
  return result;
};

export const createBanks = (IBanks) => (dispatch, getState) => {
  let result = callApi("odata/BankSuppliers", "POST", IBanks)
    .then((res) => {
      Notification("success", "Thêm mới tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      if (err.response?.data) {
        Notification("error", err.response?.data.Errors);
      }
      return false;
    });
  return result;
};

export const editBanks = (IBanks) => (dispatch, getState) => {
  let result = callApi(`odata/BankSuppliers?key=${IBanks.Id}`, "PUT", IBanks)
    .then((res) => {
      Notification("success", "Sửa tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const deleteBanks = (ID) => (dispatch, getState) => {
  let result = callApi(`odata/BankSuppliers?banksupplier_id=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa tài khoản thành công !");
      return true;
    })
    .catch((err) => {
      Notification("error", err.response.data.Errors[0]);
      return false;
    });
  return result;
};

export const getLstNhanVienByKhoaPhongID = (ID) => (dispatch, getState) => {
  callApi(`odata/Staffs?$filter=KHOAPHONGID eq ${ID}`, "GET")
    .then((res) => {
      dispatch({
        type: types.GET_NHANVIEN_BY_KHOAPHONGID,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

//Chức vụ
export const getALLPositions = () => (dispatch, getState) => {
  callApi("odata/Positions", "GET")
    .then((res) => {
      dispatch({
        type: types.GET_CHUCVU,
        payload: res.data.value,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
export const createPositions = (IPositions) => (dispatch, getState) => {
  let result = callApi("odata/Positions", "POST", IPositions)
    .then((res) => {
      Notification("success", "Thêm mới chức vụ thành công !");
      dispatch(getALLPositions());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.Errors[0]);
      return false;
    });
  return result;
};

export const editPositions = (IPositions) => (dispatch, getState) => {
  let result = callApi(
    `odata/Positions?key=${IPositions.id}`,
    "PUT",
    IPositions
  )
    .then((res) => {
      Notification("success", "Sửa chức vụ thành công !");
      dispatch(getALLPositions());
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.Errors[0]);
      return false;
    });
  return result;
};

export const deletePositions = (ID) => (dispatch, getState) => {
  callApi(`odata/Positions?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa chức vụ thành công !");
      dispatch(getALLPositions());
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa chức vụ thất bại !");
    });
};

export const CreateBidder = (data) => (dispatch, getState) => {
  let result = callApi("odata/Bidders", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.Errors[0]);
      return false;
    });
  return result;
};

export const EditBidder = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/Bidders?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.Errors[0]);
      return false;
    });
  return result;
};

export const CreateStaffBidder = (data) => (dispatch, getState) => {
  let result = callApi("odata/StaffBidders", "POST", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.errors[0]);
      return false;
    });
  return result;
};

export const EditStaffBidder = (data) => (dispatch, getState) => {
  console.log(data);
  let result = callApi(`odata/StaffBidders?key=${data.id}`, "PUT", data)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response?.data.Errors[0]);
      return false;
    });
  return result;
};

export const DeleteStaffBidder = (ID) => (dispatch, getState) => {
  callApi(`odata/StaffBidders?key=${ID}`, "DELETE")
    .then((res) => {
      Notification("success", "Xóa nhân viên thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", "Xóa nhân viên thất bại !");
    });
};

//edit medical supplies thuốc
export const EditMedicalSuppliesT = (data) => (dispatch, getState) => {
  callApi(`odata/Departments?key=${data.year}`, "PUT", data)
    .then((res) => {
      Notification("success", "Thêm danh sách thành công !");
    })
    .catch((err) => {
      console.log(err.response.data);
      Notification("error", err.response.data.Errors[0]);
    });
};
