import { Button, Col, Dropdown, Menu, Radio, Row, Spin } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getALLBenhViens } from "../../../redux/actions/BenhVien";
import { actLogin } from "../../../redux/actions/Users";
import bkg from "../../../common/assets/images/cdmtek.png";
import bkg1 from "../../../common/assets/images/OBM.jpg";
import {
  callApi,
  Notification,
  useLoading,
  useLocalStorage,
  Input,
} from "../index";
import "./index.css";

//Menu Dropdown danh sách BenhViens
const menu = (data, setValue) => {
  return (
    <Menu onClick={(e) => setValue("BENHVIENID", e.key)}>
      {_.map(data, (item) => {
        return (
          <Menu.Item
            onClick={() => setValue("BENHVIEN", `${item.code} - ${item.name}`)}
            key={item.id}
          >{`${item.code} - ${item.name}`}</Menu.Item>
        );
      })}
    </Menu>
  );
};

export default function Login(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const lstBenhViens = useSelector(
    (state) => state.BenhVienReducers.lstBenhViens
  );

  const [isLoading, setLoading] = useLoading(lstBenhViens);
  //Chuyển đổi giao diện
  const [isForgot, setForgot] = useState(false);
  const [isBV, setIsBV] = useState(true);
  //Lưu xuống localStorage
  const [isSaveInfo, setSaveInfo] = useLocalStorage("luuTT", false);
  const [isBenhVienId, setBenhVienId] = useLocalStorage("benhVienId", "");
  //Lấy danh sách bệnh viện
  useEffect(() => {
    dispatch(getALLBenhViens());
  }, []);
  const onChange = (e) => {
    setIsBV(e.target.value);
  };
  //Submit form
  const onSubmit = async (data) => {
    if (isForgot) {
      //quên mật khẩu
      const body = { Email: data.EMAIL };
      callApi(`api/AuthManagement/ForgotPassword`, "POST", JSON.stringify(body))
        .then((res) => {
          if (res.data.Result) {
            Notification(
              "success",
              "Hệ thống đã gửi mail Reset password cho bạn.Bạn vui lòng kiểm tra email"
            );
          } else {
            Notification("error", res.data.Errors[0]);
          }
        })
        .catch((err) => {
          Notification(
            "error",
            "Email bạn nhập không phải kiểu email. Vui lòng kiểm tra lại"
          );
        });
    } else {
      //check ncc or bv

      if (isBV) {
        const BENHVIENID = _.some(lstBenhViens, (x) => x.id === data.BENHVIENID)
          ? data.BENHVIENID
          : "00000000-0000-0000-0000-000000000000";
        console.log("BENHVIENID", BENHVIENID);
        setSaveInfo(data.luuTT);
        setBenhVienId(BENHVIENID);
        await dispatch(
          actLogin({ ...data, BENHVIENID, HospitalId: BENHVIENID })
        );
        history.push("/");
      } else {
        const BENHVIENID = "00000000-0000-0000-0000-000000000000";
        await dispatch(actLogin({ ...data, BENHVIENID }));
        history.push("/nha-thau/ho-so-du-thau");
      }
    }
  };
  return (
    <div className="login-page">
      <div className="left-side">
        <div className="bkg-logo">
          <div className="logo-title">
            <h1>Tek.OBM</h1>
            <p>Quản lý đấu thầu online</p>
          </div>
          <div className="logo-obm">
            <img src={bkg1} alt="" />
          </div>
        </div>
        <div className="contact-box">
          <ul className="list-icon">
            <li className="icon">
              <a href="">
                <i className="fa-brands fa-facebook"></i>
              </a>
            </li>
            <li className="icon">
              <a href="">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </li>
            <li className="icon">
              <a href="">
                <i className="fa-solid fa-location-dot"></i>
              </a>
            </li>
            <li className="icon">
              <a href="">
                <i className="fa-solid fa-phone"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bkg-login">
        {isForgot ? (
          <div className="box-forgot">
            <p className="box-login-title">Quên mật khẩu</p>
            <div className="straight"></div>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <p>
                Liên kết đặt lại mật khẩu sẽ được gửi đến email của bạn để đặt
                lại mật khẩu của bạn. Nếu bạn không nhận được email trong vòng
                vài phút, vui lòng thử lại.
              </p>
              <div style={{ marginBottom: "10px" }}>
                <Input
                  label={"Email"}
                  name={register("EMAIL", { required: true })}
                  required
                  errors={errors}
                  autoComplete="off"
                  type="email"
                />
              </div>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <button
                    className="btn-forgot"
                    onClick={() => setForgot(false)}
                  >
                    Trở về
                  </button>
                </Col>
                <Col span={6}>
                  <button className="btn-forgot" type="submit">
                    Gửi đi
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        ) : (
          <div className="box-login">
            <p className="box-login-title">Đăng nhập</p>
            <div className="straight"></div>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {isBV ? (
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="bv">Bệnh viện</label>
                  <Dropdown overlay={menu(lstBenhViens, setValue)}>
                    <input
                      {...register("BENHVIEN")}
                      id="bv"
                      autoComplete="off"
                    />
                  </Dropdown>
                </div>
              ) : null}

              <div style={{ marginBottom: "10px" }}>
                <Input
                  label={"Tài khoản"}
                  name={register("Username", { required: true })}
                  required
                  errors={errors}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Input
                  label={"Mật khẩu"}
                  name={register("Password", { required: true })}
                  required
                  errors={errors}
                  type="password"
                />
              </div>
              <div className="box-ncc-bv">
                <Radio.Group
                  onChange={onChange}
                  value={isBV}
                  defaultValue={true}
                >
                  <Radio value={true}>Bệnh viện</Radio>
                  <Radio value={false}>Nhà thầu</Radio>
                </Radio.Group>
              </div>
              <p className="forgot-pass" onClick={() => setForgot(true)}>
                Quên mật khẩu ?
              </p>
              <button type="submit">Đăng nhập</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

Login.propTypes = {};

Login.defaultProps = {};
