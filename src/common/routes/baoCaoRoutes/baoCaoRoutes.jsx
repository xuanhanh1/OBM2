import DMKhongNhaThau from "../../../components/layouts/BaoCao/DMKhongNhaThau/DMKhongNhaThau";
import DMKTrungThau from "../../../components/layouts/BaoCao/DMKTrungThau/DMKTrungThau";
import DuThau from "../../../components/layouts/BaoCao/DuThau/DuThau";
import HoSoMoiThau from "../../../components/layouts/BaoCao/HoSoMoiThau/HoSoMoiThau";
import NhaThau from "../../../components/layouts/BaoCao/NhaThau/NhaThau";
import NhaThauTrungThau from "../../../components/layouts/BaoCao/NhaThauTrungThau/NhaThauTrungThau";
import ChamThau from "../../../components/layouts/ChamThau/ChamThau/ChamThau";
import DMKLuaChonDuocNT from "../../../components/layouts/BaoCao/DMKDatTCKT/DMKLuaChonDuocNT";
import TrangThaiNhaThau from "../../../components/layouts/ChamThau/TrangThaiNhaThau/TrangThaiNhaThau";

const baoCaoRoutes = [
  {
    path: "/bao-cao/ho-so-moi-thau",
    exact: false,
    main: ({ history }) => <HoSoMoiThau history={history} />,
  },
  {
    path: "/bao-cao/mua-ho-so",
    exact: false,
    main: ({ history }) => <NhaThau history={history} />,
  },
  {
    path: "/bao-cao/du-thau",
    exact: false,
    main: ({ history }) => <DuThau history={history} />,
  },
  {
    path: "/bao-cao/nha-thau-trung-thau",
    exact: false,
    main: ({ history }) => <NhaThauTrungThau history={history} />,
  },
  {
    path: "/bao-cao/danh-muc-khong-co-nha-thau",
    exact: false,
    main: ({ history }) => <DMKhongNhaThau history={history} />,
  },
  {
    path: "/bao-cao/danh-muc-khong-trung-thau",
    exact: false,
    main: ({ history }) => <DMKTrungThau history={history} />,
  },
  {
    path: "/bao-cao/khong-duoc-lua-chon",
    exact: false,
    main: ({ history }) => <DMKLuaChonDuocNT history={history} />,
  },
];

export default baoCaoRoutes;
