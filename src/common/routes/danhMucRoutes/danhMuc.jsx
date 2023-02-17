import KhoaPhong from "../../../components/layouts/DanhMuc/khoaPhong/khoaPhong";
import ChucVu from "../../../components/layouts/DanhMuc/chucVu/chucVu";
import LoaiNhaThau from "../../../components/layouts/DanhMuc/loaiNhaThau/LoaiNhaThau";

const danhMucRoute = [
  {
    path: "/danh-muc/khoa-phong",
    exact: false,
    main: ({ history }) => <KhoaPhong history={history} />,
  },

  {
    path: "/danh-muc/chuc-vu",
    exact: false,
    main: ({ history }) => <ChucVu history={history} />,
  },
  {
    path: "/danh-muc/nha-thau",
    exact: false,
    main: ({ history }) => <LoaiNhaThau history={history} />,
  },
];

export default danhMucRoute;
