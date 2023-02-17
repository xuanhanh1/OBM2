import React from "react";
import _ from "lodash";
import DanhMucRoutes from "./danhMucRoutes/danhMuc";
import QuanTriRoute from "./quanTriRoutes/quanTri";
import hoSoMoiThauRoute from "./hoSoMoiThauRoute/hoSoMoiThau";
import thuocVatTuRoute from "./thuocVatTu/thuocVatTuRoute";
import thamGiaThauRoute from "./thamGiaThau/thamGiaThau";
import NhaThauRoutes from "./nhaThauRoutes/nhaThau";
import chamThauRoute from "./chamThauRoute/chamThauRoute";
import baoCaoRoutes from "./baoCaoRoutes/baoCaoRoutes";
// import HopDongRoutes from "./hopDongRoutes/hopDongRoutes";
// import ThuocVatTuRoutes from "./thuocVatTuRoutes/thuocVatTuRoutes";
// import NhaCungCapRoutes from "./nhaCungCapRoutes/nhaCungCapRoutes";
// import ThanhToanRoutes from "./thanhToanRoutes/thanhToanRoutes";
// import BaoCaoRoutes from "./baoCaoRoutes/baoCaoRoutes";
var routes = [];
const exportArrayToObject = (array) => {
  routes = _.concat(routes, array);
};
exportArrayToObject([
  ...DanhMucRoutes,
  ...QuanTriRoute,
  ...hoSoMoiThauRoute,
  ...thuocVatTuRoute,
  ...thamGiaThauRoute,
  ...NhaThauRoutes,
  ...chamThauRoute,
  ...baoCaoRoutes,
  // ...HopDongRoutes,
  // ...ThuocVatTuRoutes,
  // ...NhaCungCapRoutes,
  // ...ThanhToanRoutes,
  // ...BaoCaoRoutes,
]);
// exportArrayToObject(QuanTriRoute);
// exportArrayToObject(HopDongRoutes);
// exportArrayToObject(ThuocVatTuRoutes);
// exportArrayToObject(NhaCungCapRoutes);
// exportArrayToObject(ThanhToanRoutes);
// exportArrayToObject(BaoCaoRoutes);
export default routes;
