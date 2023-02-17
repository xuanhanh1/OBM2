// import VaiTro from "../../../components/layouts/QuanTri/vaiTro/vaiTro";
import NopHoSoThay from "../../../components/layouts/ThamGiaThau/NopHoSoThau/NopHoSoThau";
import XemKQDuThau from "../../../components/layouts/ThamGiaThau/XemKQDuThau/XemKQDuThau";
const thamGiaThauRoute = [
  {
    path: "/nha-thau/ho-so-du-thau",
    exact: false,
    main: ({ history }) => <NopHoSoThay history={history} />,
  },
  {
    path: "/nha-thau/xem-ket-qua-du-thau",
    exact: false,
    main: ({ history }) => <XemKQDuThau history={history} />,
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

export default thamGiaThauRoute;
