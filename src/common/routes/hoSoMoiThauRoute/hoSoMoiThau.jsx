// import VaiTro from "../../../components/layouts/QuanTri/vaiTro/vaiTro";
import DanhMucThau from "../../../components/layouts/HoSoMoiThau/DanhMucThau/DanhMucThau";
import HoSoMoiThau from "../../../components/layouts/HoSoMoiThau/HoSoMoiThau/HoSoMoiThau";
import NhaThauThamGiaThau from "../../../components/layouts/HoSoMoiThau/NhaThauThamGiaThau/NhathauThamGiaThau";
import TieuChiKyThuat from "../../../components/layouts/HoSoMoiThau/TieuChiKyThuat/TieuChiKyThuat";
import ToChamThau from "../../../components/layouts/HoSoMoiThau/ToChamThau/toChamThau";
const hoSoMoiThauRoute = [
  {
    path: "/ho-so-moi-thau/ho-so-moi-thau",
    exact: false,
    main: ({ history }) => <HoSoMoiThau history={history} />,
  },
  {
    path: "/ho-so-moi-thau/to-cham-thau",
    exact: false,
    main: ({ history }) => <ToChamThau history={history} />,
  },
  {
    path: "/ho-so-moi-thau/nha-thau-tham-gia-thau",
    exact: false,
    main: ({ history }) => <NhaThauThamGiaThau history={history} />,
  },
  {
    path: "/ho-so-moi-thau/danh-muc-thau",
    exact: false,
    main: ({ history }) => <DanhMucThau history={history} />,
  },
  {
    path: "/ho-so-moi-thau/tieu-chi-ky-thuat",
    exact: false,
    main: ({ history }) => <TieuChiKyThuat history={history} />,
  },
];

export default hoSoMoiThauRoute;
