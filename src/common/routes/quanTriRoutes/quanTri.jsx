import VaiTro from "../../../components/layouts/QuanTri/vaiTro/vaiTro";
import NhanVien from "../../../components/layouts/QuanTri/nhanVien/nhanVien";
// import NhatKyNguoiDung from "../../../components/layouts/QuanTri/nhatKyNguoiDung/nhatKyNguoiDung";
const quanTriRoute = [
  {
    path: "/quan-tri/vai-tro",
    exact: false,
    main: ({ history }) => <VaiTro history={history} />,
  },
  {
    path: "/quan-tri/nhan-vien",
    exact: false,
    main: ({ history }) => <NhanVien history={history} />,
  },
  // {
  //   path: "/quan-tri/nhat-ky-nguoi-dung",
  //   exact: false,
  //   main: ({ history }) => <NhatKyNguoiDung history={history} />,
  // },
];

export default quanTriRoute;
