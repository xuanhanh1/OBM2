import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { callApi, _ } from "../../index";
import { Notification } from "../../index";
import { useSelector } from "react-redux";
import { toUpperPropertyName } from "../../../controller/Format";
import {
  BrowserRouter as Redirect,
  Route,
  Link,
  Switch,
  useParams,
} from "react-router-dom";
import moment from "moment";
function xoa_dau(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}
const TT_BV = [
  "Chờ nhà cung cấp xác nhận",
  "Đã hủy phiếu gọi hàng",
  "Nhà cung cấp gửi thông tin xác nhận",
  "Hoàn thành",
  "Đã xác nhận giao hàng",
];
const TT_NCC = [
  "Danh sách chờ xác nhận đơn hàng",
  "Danh sách bệnh viện hủy đơn hàng",
  "Danh sách đã xác nhận đơn hàng",
  "Danh sách gọi hàng hoàn thành",
  "Danh sách bệnh viện xác nhận giao hàng",
];
const TT = [
  "Tạo mới phiếu gọi hàng",
  "Bệnh viện hủy phiếu gọi hàng",
  "Nhà cung cấp xác nhận phiếu gọi hàng",
  "Hoàn thành",
  "Bệnh viện xác nhận giao hàng",
];
const checkAccountNoti = (BENHVIENID, SUPPLIER_ID) => {
  if (BENHVIENID !== null && SUPPLIER_ID === null) {
    // la benh vien
    return true;
  }
  if (SUPPLIER_ID !== null && BENHVIENID === null) {
    // la nha cung cap
    return false;
  }
};
function PBHNotification(props) {
  const [notiList, setNotiList] = useState([]);

  const connection = useSelector((state) => state.UsersReducers.connection);
  const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));

  useEffect(() => {
    //get all notification
    callApi("odata/Notifications", "GET")
      .then((res) => {
        if (res.data.length > 0) {
          console.log(nhanVienInfor);
          if (
            checkAccountNoti(
              nhanVienInfor.BENHVIENID,
              nhanVienInfor.SUPPLIER_ID
            )
          ) {
            //benh vien
            let noti = res.data.filter((item) => {
              if (
                nhanVienInfor.BENHVIENID === item.BenhVien_Id &&
                (item.TenTrangThai === TT[2] || item.TenTrangThai === TT[3])
              ) {
                return item;
              }
            });
            setNotiList(noti);
          } else {
            //nha cung cap
            let noti = res.data.filter((item) => {
              if (item.NCC_Id === nhanVienInfor.SUPPLIER_ID) {
                if (
                  item.TenTrangThai === TT[0] ||
                  item.TenTrangThai === TT[1] ||
                  item.TenTrangThai === TT[4]
                ) {
                  return item;
                }
              }
            });
            setNotiList(noti);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on(
            `ReceiveNotification_${nhanVienInfor.Id}`, //lấy notification theo mã nhân viên
            (notiViewModel) => {
              console.log(notiViewModel);
              let noti = toUpperPropertyName(notiViewModel);
              const newNoti = { ...noti, Id: noti.ID };
              const newNotiList = [newNoti, ...notiList];
              setNotiList(newNotiList);
            }
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, [notiList]);

  const handleNotiClick = (noti) => {
    // gui api update lại trạng thái seen
    if (!noti.Seen) {
      callApi(`odata/Notifications?key=${noti.Id}`, "PUT")
        .then((res) => {
          const data = [...notiList].map((x) => {
            if (x.Id === noti.Id) {
              x.Seen = true;
            }
            return x;
          });
          setNotiList(data);
        })
        .catch((err) => {
          Notification("error", err.response.data);
        });
    }
  };
  const renderBV = (nameTT) => {
    if (nameTT === TT[2]) {
      return TT_BV[2];
    }
    if (nameTT === TT[3]) {
      return TT_BV[3];
    }
  };
  const renderNCC = (nameTT) => {
    if (nameTT === TT[0]) {
      return TT_NCC[0];
    }
    if (nameTT === TT[1]) {
      return TT_NCC[1];
    }
    if (nameTT === TT[4]) {
      return TT_NCC[4];
    }
  };
  const menu = (
    <div className="pbh-noti">
      {notiList.length > 0 ? (
        <Menu>
          {notiList.map((item, index) => {
            let trangthai = xoa_dau(item.TenTrangThai.split(" ").join("-"));
            return (
              <Menu.Item
                key={item?.Id}
                className="item-noti"
                style={{
                  height: "auto",
                  padding: "10px 10px",
                  borderRadius: "10px",
                }}
                onClick={() => handleNotiClick(item)}
              >
                <Link
                  to={
                    checkAccountNoti(
                      nhanVienInfor.BENHVIENID,
                      nhanVienInfor.SUPPLIER_ID
                    )
                      ? `/hop-dong/phieu-goi-hang/${trangthai}`
                      : `/nha-cung-cap/phieu-goi-hang/${trangthai}`
                  }
                >
                  <Badge dot={!item?.Seen}>
                    <div
                      style={{
                        cursor: "pointer",
                        width: "auto",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <p
                        className="donvitao-noti"
                        style={{ overflowWrap: "break-word" }}
                      >
                        {checkAccountNoti(
                          nhanVienInfor.BENHVIENID,
                          nhanVienInfor.SUPPLIER_ID
                        )
                          ? `${item?.Ten_NCC}`
                          : `${item?.BenhVien_Name}`}
                      </p>

                      <p className="content-noti">
                        {checkAccountNoti(
                          nhanVienInfor.BENHVIENID,
                          nhanVienInfor.SUPPLIER_ID
                        )
                          ? renderBV(item.TenTrangThai)
                          : renderNCC(item.TenTrangThai)}
                      </p>
                      <p className="content-noti" style={{ width: "100%" }}>
                        Phiếu gọi hàng: <b>{item?.OrderSupplier_Name}</b> -{" "}
                        <wbr></wbr>
                        {moment(item?.CreateDate).format("DD-MM-YYYY")}
                      </p>

                      <p className="time-noti">
                        {moment(
                          moment(item?.CreateDate).format("YYYY-MM-DD HH:mm:ss")
                        ).fromNow()}
                      </p>
                    </div>
                  </Badge>
                </Link>
              </Menu.Item>
            );
          })}
        </Menu>
      ) : null}
    </div>
  );

  return (
    <p>
      <Badge
        count={_.filter(notiList, (x) => !x?.Seen).length}
        overflowCount={9}
        offset={[-1, 2]}
        size="small"
        style={{
          animation:
            _.filter(notiList, (x) => !x?.seen).length === 0
              ? ""
              : "tada 3.5s ease infinite",
        }}
      >
        <Dropdown overlay={menu} trigger={["hover"]}>
          <BellOutlined style={{ fontSize: "20px", padding: "8px" }} />
        </Dropdown>
      </Badge>
    </p>
  );
}

export default PBHNotification;
