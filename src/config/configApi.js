import axios from "axios";
// const config = require("./default.json");
export default function callApi(
  endpoint,
  method = "GET",
  body,
  contentType = "application/json; charset=utf8; odata.metadata=minimal; odata.streaming=true"
) {
  //Get token user
  const token = JSON.parse(localStorage.getItem("token"));
  //Get thông tin IP user để làm history
  let infoIP = JSON.parse(localStorage.getItem("infoIP"));

  if (infoIP === null || infoIP == undefined) {
    fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        console.log("data configApi", data);
        window.localStorage.setItem("infoIP", JSON.stringify(data));
        infoIP = JSON.parse(localStorage.getItem("infoIP"));
      });
  }
  //Get bệnh viên Id
  const benhVienId = JSON.parse(localStorage.getItem("benhVienId"));
  if (benhVienId === null || benhVienId === undefined) {
    return axios({
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        isLog: "false",
      },
      method: method,
      url: `${window.BASE_URL}/${endpoint}`,
      data: body,
    });
  } else {
    return axios({
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        client_ip_address: infoIP.IPv4,
        country_name: infoIP.country_name,
        state: infoIP.state,
        url: window.location.pathname,
      },
      method: method,
      url: `${window.BASE_URL}/${endpoint}`,
      data: body,
    });
  }
}
