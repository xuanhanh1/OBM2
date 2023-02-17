import Thuoc from "../../../components/layouts/ThuocVatTu/Thuoc/thuoc";
import VatTu from "../../../components/layouts/ThuocVatTu/VatTu/vatTu";
import HoaChat from "../../../components/layouts/ThuocVatTu/HoaChat/HoaChat";

const thuocVatTuRoute = [
  {
    path: "/thuoc-vat-tu/thuoc",
    exact: false,
    main: ({ history }) => <Thuoc history={history} />,
  },
  {
    path: "/thuoc-vat-tu/vat-tu",
    exact: false,
    main: ({ history }) => <VatTu history={history} />,
  },
  {
    path: "/thuoc-vat-tu/hoa-chat",
    exact: false,
    main: ({ history }) => <HoaChat history={history} />,
  },
];

export default thuocVatTuRoute;
