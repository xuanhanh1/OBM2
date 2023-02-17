// import React, { useState, useEffect } from "react";
// import "../index.css";
// import { useLoading, logoTekmedi, useLocalStorage, callApi, Notification } from "../../index";
// import { useForm } from "react-hook-form";
// import { Button, Spin, Dropdown, Menu, Row, Col } from "antd";
// import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom";
// import { createBrowserHistory } from "history";
// const getUrlParameter = (sParam) => {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
//     return false;
// };
// function ResetPassword(props) {
//     const history = createBrowserHistory();
//     const { t } = useTranslation();
//     const { register, handleSubmit, setValue } = useForm();

//     const [isLoading, setLoading] = useState(false);
//     const email = getUrlParameter('email');
//     setValue("Email", email);

//     //Submit form
//     const onSubmit = (data) => {
//         if(data.Password !== data.ConfirmPassword){
//             Notification("warning", "Mật khẩu mới và Xác nhận mật khẩu không trùng nhau.");
//             return;
//         }
//         setLoading(true);
//         const token = getUrlParameter('token');

//         const body = {
//             Password: data.Password,
//             ConfirmPassword: data.ConfirmPassword,
//             Email: email,
//             Token: token,
//         };
//         callApi(`api/AuthManagement/ResetPassword`, "POST", body)
//             .then(res => {
//                 console.log(res);
//                   if (res.data.Result) {
//                     setLoading(false);
//                     Notification("success", 'Đổi password thành công.');
//                     setTimeout(() => {
//                         window.location = '/login';
//                       }, 1500);
//                   }
//                   else {
//                     setLoading(false);
//                     Notification("error", res.data.Errors[0]);
//                   }
//             })
//             .catch(err => {
//                 setLoading(false);
//                 Notification("error", "Lỗi hệ thống. Bạn vui lòng thử lại sau.");
//             });
//     };
//     return (
//         <Spin spinning={isLoading} size="large">
//             <div className="Login">
//                 <div className="bgTop">
//                     <div className="_boxTitle">
//                         <img src={logoTekmedi} className="__iconLogin" />
//                         <h1 style={{ fontWeight: 600 }}>TEK.PRM</h1>
//                         <h2 style={{ fontWeight: "normal" }}>Quản lý sửa chữa thiết bị</h2>
//                     </div>
//                 </div>
//                 <div className="bgCenter">
//                     <div className="_boxLogin">
//                         <h1 style={{ fontWeight: 600 }}>Reset Password</h1>
//                         <form className="form" onSubmit={handleSubmit(onSubmit)}>
//                             <input
//                                 {...register("Email", { required: true })}
//                                 placeholder='Email'
//                                 disabled={true}
//                             />
//                             <input
//                                 {...register("Password", { required: true })}
//                                 placeholder={t("MatKhauMoi")}
//                                 type="password"
//                             />
//                             <input
//                                 {...register("ConfirmPassword", { required: true })}
//                                 placeholder={t("XacNhanMatKhau")}
//                                 type="password"
//                             />
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: "row",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                 }}
//                             >
//                             </div>
//                             <button type="submit">{t("XacNhan")}</button>
//                         </form>
//                         <Row>
//                         <Button onClick={() =>   window.location = '/login'}>Đăng nhập</Button>

//                         </Row>
//                     </div>
//                 </div>
//                 <div className="bgBottom"></div>
//             </div>
//         </Spin>
//     );
// }

// export default ResetPassword;

import React from "react";
import PropTypes from "prop-types";

const ResetPassword = (props) => {
  return <div>ResetPassword</div>;
};

ResetPassword.propTypes = {};

export default ResetPassword;
