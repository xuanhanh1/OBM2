// import VaiTro from "../../../components/layouts/QuanTri/vaiTro/vaiTro";
import NhaThau from "../../../components/layouts/DauThau/ChamThau";
const NhaThauRoutes = [
  {
    path: "/dau-thau/cham-thau",
    exact: false,
    main: ({ history }) => <NhaThau history={history} />,
  },

  // {
  //   path: "/quan-tri/nhan-vien",
  //   exact: false,
  //   main: ({ history }) => <NhanVien history={history} />,
  // },
  // {
  //   path: "/quan-tri/nhat-ky-nguoi-dung",
  //   exact: false,
  //   main: ({ history }) => <NhatKyNguoiDung history={history} />,
  // },
];

export default NhaThauRoutes;
