import ChamThau from "../../../components/layouts/ChamThau/ChamThau/ChamThau";
import KQChamThauKT from "../../../components/layouts/ChamThau/KetQuaChamThauKT/KQChamThauKT";
import KQChamThauGia from "../../../components/layouts/ChamThau/KQChamThauGia/KQChamThauGia";
import PhanCongChamThau from "../../../components/layouts/ChamThau/PhanCongChamThau/PhanCongChamThau";
import ThongBaoKQ from "../../../components/layouts/ChamThau/ThongBaoKetQua/ThongBaoKQ";
import ThuGiamGia from "../../../components/layouts/ChamThau/ThuGiamGia/ThuGiamGia";
import TongHopKetQua from "../../../components/layouts/ChamThau/TongHopKetQua/TongHopKetQua";
import TraCuuHoSo from "../../../components/layouts/ChamThau/TraCuuHoSo/TraCuuHoSo";
import TrangThaiNhaThau from "../../../components/layouts/ChamThau/TrangThaiNhaThau/TrangThaiNhaThau";

const chamThauRoute = [
  {
    path: "/cham-thau/cham-thau",
    exact: false,
    main: ({ history }) => <ChamThau history={history} />,
  },
  {
    path: "/cham-thau/cap-nhat-trang-thai-nha-thau",
    exact: false,
    main: ({ history }) => <TrangThaiNhaThau history={history} />,
  },
  {
    path: "/cham-thau/ket-qua-cham-thau",
    exact: false,
    main: ({ history }) => <KQChamThauKT history={history} />,
  },
  {
    path: "/cham-thau/tong-hop-ket-qua-cham-thau",
    exact: false,
    main: ({ history }) => <KQChamThauGia history={history} />,
  },
  {
    path: "/cham-thau/thong-bao-ket-qua-cham-thau",
    exact: false,
    main: ({ history }) => <ThongBaoKQ history={history} />,
  },
  {
    path: "/cham-thau/tong-hop-ket-qua",
    exact: false,
    main: ({ history }) => <TongHopKetQua history={history} />,
  },
  {
    path: "/cham-thau/tra-cuu-ho-so",
    exact: false,
    main: ({ history }) => <TraCuuHoSo history={history} />,
  },
  {
    path: "/cham-thau/phan-cong-cham-thau",
    exact: false,
    main: ({ history }) => <PhanCongChamThau history={history} />,
  },
  {
    path: "/cham-thau/thu-giam-gia",
    exact: false,
    main: ({ history }) => <ThuGiamGia history={history} />,
  },
];

export default chamThauRoute;
