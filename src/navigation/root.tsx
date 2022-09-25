import { useEffect, useState } from "react";
import { message, notification } from "antd";
import { BrowserRouter as Router } from "react-router-dom";

import { getCurrentUserId, login } from "../api/auth";
import { Login } from "../pages";
import MainStack from "./stacks/mainStack";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsThunk,
  liveQuerySubscribeThunk,
} from "../core/notificationSlice";

function Root() {
  // Sate
  const [userId, setUserId] = useState<string | undefined>(getCurrentUserId());

  const { subscribe } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  // Handlers
  const errorNotification = (msg: string) => {
    message.error(msg);
  };

  const openNotification = (
    title: string,
    desc?: string,
    onClick?: () => void
  ) => {
    notification.open({
      message: title,
      description: desc,
      onClick: onClick,
      style: { backgroundColor: "#f0f0f0" },
      type: "info",
      placement: "bottomLeft",
    });
  };

  const handleLogin = (username: string, password: string) => {
    login(username, password)
      .then((_id) => setUserId(_id))
      .catch((err) => {
        errorNotification(err.message);
      });
  };

  useEffect(() => {
    subscribe?.on("create", (object) => {
      openNotification(`un ${object.toJSON().for} est ajouté`);
      dispatch(getNotificationsThunk());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);

  useEffect(() => {
    dispatch(liveQuerySubscribeThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Display the main stack if the user id logged in */}
      <Router>
        {userId ? <MainStack /> : <Login handleLogin={handleLogin} />}
      </Router>
    </div>
  );
}

export default Root;
