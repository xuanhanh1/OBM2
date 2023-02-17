import { notification } from "antd";
//type error,warning,success
export default function openNotificationWithIcon(type, message, description) {
  notification[type]({
    message: message,
    description: description,
  });
}
