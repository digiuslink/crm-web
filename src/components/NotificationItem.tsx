import { Menu, Avatar, Typography } from "antd";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteNotif, INotification } from "../api/notifications";
import { getNotificationsThunk } from "../core/notificationSlice";

interface INotificationProps {
  linkTo: string;
  title: string;
  icon?: ReactNode;
  visited?: boolean;
  notif?: INotification;
}

function NotificationItem({
  icon,
  linkTo,
  title,
  visited,
  notif,
}: INotificationProps) {
  const dispatch = useDispatch();
  return (
    <Menu.Item
      style={{ padding: 4, minWidth: 250 }}
      onClick={async () => {
        await deleteNotif(notif);
        dispatch(getNotificationsThunk());
      }}
    >
      <Link to={linkTo}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            icon={icon}
            style={!visited ? { backgroundColor: "#87d068" } : undefined}
          />
          <Typography.Text
            style={{ marginLeft: 4 }}
            type={!visited ? null : "secondary"}
          >
            {title}
          </Typography.Text>
        </div>
      </Link>
    </Menu.Item>
  );
}

export default NotificationItem;
