import "antd/dist/antd.css"; //
import "devextreme/dist/css/dx.common.css"; //
import "devextreme/dist/css/dx.light.css"; //
import _ from "lodash"; //
import { useEffect } from "react"; //
import { useDispatch, useSelector } from "react-redux"; //
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useRouteMatch,
} from "react-router-dom"; //
import "./App.css"; //
import "./OBM.css"; //
import ResetPassword from "./components/layouts/Login/ResetPassword/resetPassword";
import { setStatusLoginWithToken } from "./redux/actions/Users"; //
import Login from "./components/layouts/Login/login"; //
import Main from "./components/layouts/Main/main"; //
import T from "./common/language/i18n/i18n"; //

function App() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.UsersReducers.language);

  const token = JSON.parse(window.localStorage.getItem("token"));

  useEffect(() => {
    const isNV = JSON.parse(window.localStorage.getItem("infoNV"));
    if (!_.isNull(token)) {
      dispatch(setStatusLoginWithToken(true, token, isNV));
    }
  }, []);
  let match = useRouteMatch();
  useEffect(() => {
    T(language);
  }, [language]);

  return (
    <div className="App">
      {window.location.pathname === "/Account/ResetPassword" ? (
        <Switch>
          <Route>
            <ResetPassword></ResetPassword>
          </Route>
        </Switch>
      ) : _.isEmpty(token) ? (
        <Login />
      ) : (
        <Main />
      )}
    </div>
  );
}

export default App;
