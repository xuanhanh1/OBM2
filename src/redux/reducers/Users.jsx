import {
  CHANGE_LANGUAGE,
  LOGIN,
  DESTROY_SESSION,
  CONNECTION_SIGNALR,
} from "../contants/actionTypes";
import { createBrowserHistory } from "history";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
const initialState = {
  loginSuccess: undefined,
  language: "vi",
  connection: null,
};
const UsersReducers = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      if (action.payload.Result === true) {
        // const history = createBrowserHistory();
        // history.push("/");
        //const nhanVienInfor = JSON.parse(window.localStorage.getItem("infoNV"));
        const CONNECTION = new HubConnectionBuilder()
          .withUrl(`${window.BASE_URL}/Notification/UserNotiHub`)
          //.withAutomaticReconnect()
          .build();

        return {
          ...state,
          loginSuccess: action.payload.Result,
          connection: CONNECTION,
        };
      }
      return {
        ...state,
        loginSuccess: action.payload.Result,
        connection: null,
      };
    }
    case CONNECTION_SIGNALR:
      return {
        ...state,
        connection: action.connection,
      };
    case DESTROY_SESSION:
      return {
        ...state,
        loginSuccess: false,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
};

export default UsersReducers;
