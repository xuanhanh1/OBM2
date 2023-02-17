import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLoading } from "../index";
import logo from "../../../../src/common/assets/images/favicon.ico.jpg";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import DrawerUser from "./DrawerUser/drawerUser";
import { Route, Link, Switch, useHistory, useLocation } from "react-router-dom";
import routes from "../../../common/routes/index";
import { getMenusByUser, setCurrentMenu } from "../../../redux/actions/Menu";
import "./index.css";
import _ from "lodash";

import ErrorPage from "../../../common/errorPage/errorPage";
import PBHNotification from "./Notification/notification";
import Dashboard from "../DanhMuc/Dashboard/dashboard";

const { Header, Content } = Layout;
const localStorageMenu = localStorage.getItem("currentMenu");
const nameMenu = localStorage.getItem("nameMenu");

const DropdownWrapper = (child) => {
  if (child.length == 0) {
    return <div></div>;
  }

  return (
    <div className="DropDownWrapper">
      <ul>
        {_.map(child, (item, index) => {
          return (
            <Link to={item.ROUTE} key={index}>
              <li>
                <a
                  style={{
                    color:
                      window.location.pathname === item.ROUTE ? "#EE202A" : "",
                  }}
                >
                  <i className={`fa ${item.ICON}`} /> {item.TEN_MENU}
                </a>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
function Main(props) {
  let location = useLocation();
  const [isClicked, setClicked] = useState(false);
  const [vibDrawerUser, setVibDrawerUser] = useState(false);
  const lstMenu = useSelector((state) =>
    _.sortBy(state.MenuReducers.lstMenu, "THUTU")
  );
  const lstChildMenu = useSelector((state) => state.MenuReducers.lstChildMenu);
  const [isRoutes, setRoutes] = useState([]);
  const [isHeaderLoading, setHeaderLoading] = useLoading(lstMenu);
  const dispatch = useDispatch();
  const history = useHistory();
  const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));

  useEffect(() => {
    if (nhanVienInfor.TEN_BV !== null) {
      document.title =
        "OBM - Quản lý đấu thầu online - Tekmedi | " + nhanVienInfor.TEN_BV;
      document.title = "OBM - Quản lý đấu thầu online - Tekmedi";
    }
    dispatch(getMenusByUser());

    if (!_.isNull(nhanVienInfor.bidder_id)) {
      // history.push("/nha-cung-cap/phieu-goi-hang");
      history.push("/nha-thau/ho-so-du-thau");
    }
    getInforIpClient();
  }, []);

  const getInforIpClient = async () => {
    fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.setItem("infoIP", JSON.stringify(data));
      })
      .catch((err) => console.log(err.response));
  };

  useEffect(() => {
    if (!_.isEmpty(lstChildMenu)) {
      let arr = _.filter(routes, (x) =>
        _.some(lstChildMenu, (y) => y.ROUTE === x.path)
      );
      arr.push(
        ...[
          {
            path: "/error-page",
            exact: false,
            main: ({ history }) => (
              <>
                <ErrorPage history={history} />
              </>
            ),
          },
          {
            path: "/",
            exact: false,
            main: ({ history }) => (
              <>
                <Dashboard history={history} />
              </>
            ),
          },
        ]
      );

      setRoutes(arr);
      if (!_.some(arr, (x) => x.path === window.location.pathname)) {
        history.push("/error-page");
      }
    }
  }, [lstChildMenu]);

  const [currentMenu, setCurrentMenu] = useState("");

  useEffect(() => {
    const result = lstChildMenu.find(
      (item) => item.ROUTE === window.location.pathname
    );
    localStorage.setItem("currentMenu", result?.ROUTE);
    localStorage.setItem("nameMenu", result?.TEN_MENU);

    setCurrentMenu(result);
  }, [window.location.pathname]);
  console.log("render - main");
  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="_Header">
            <nav>
              <div className="d-flex align-items-center">
                <div className="__NavBarLogo">
                  <a href="http://tekmedi.com">
                    <h1 className="___textLogo">
                      <div className="d-flex-center">
                        <img src={logo} /> <span>Tek.OBM</span>
                      </div>
                    </h1>
                  </a>
                </div>
                <div className={isHeaderLoading ? "spin-center" : null}>
                  <Spin spinning={isHeaderLoading}>
                    <ul
                      className={isClicked ? "nav-links active" : "nav-links"}
                    >
                      {_.map(lstMenu, (item, index) => {
                        return (
                          <Dropdown overlay={DropdownWrapper(item.CHILDREN)}>
                            <li>
                              {item.CHILDREN.length > 0 ? (
                                <span
                                  className={
                                    "/" +
                                      window.location.pathname.split("/")[1] ===
                                    item.ROUTE
                                      ? "active"
                                      : null
                                  }
                                >
                                  <span className="material-icons md-16">
                                    {item.ICON}&nbsp;
                                  </span>
                                  {item.TEN_MENU}&nbsp;
                                  {item.CHILDREN.length > 0 ? (
                                    <DownOutlined style={{ fontSize: 10 }} />
                                  ) : null}
                                </span>
                              ) : (
                                <Link to={item.ROUTE}>
                                  <span className="material-icons md-16">
                                    {item.ICON}&nbsp;
                                  </span>
                                  {item.TEN_MENU}
                                </Link>
                              )}
                            </li>
                          </Dropdown>
                        );
                      })}
                    </ul>
                  </Spin>
                </div>
              </div>
              {!isHeaderLoading && (
                <div>
                  <p style={{ color: "#EE202A", fontWeight: "bold" }}>
                    {localStorageMenu === window.location.pathname
                      ? nameMenu
                      : currentMenu?.TEN_MENU}
                  </p>
                </div>
              )}
              <div className="_infoBar">
                {/* <PBHNotification /> */}
                <p
                  onClick={() => setVibDrawerUser(true)}
                  className="div-username"
                >
                  <UserOutlined style={{ fontSize: "20px" }} />
                  <span>&nbsp; {nhanVienInfor?.USERNAME}</span>
                </p>
              </div>
            </nav>
          </div>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Switch location={location}>
            {isRoutes.length > 0 &&
              isRoutes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />
                );
              })}
          </Switch>
        </Content>
      </Layout>
      <DrawerUser isVisible={vibDrawerUser} onClose={setVibDrawerUser} />
    </div>
  );
}
export default Main;
