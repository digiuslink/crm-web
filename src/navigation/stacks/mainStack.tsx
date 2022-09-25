import { Menu, Layout, Dropdown, message, Button, Badge } from "antd";
import Title from "antd/lib/typography/Title";
import {
  BookOutlined,
  EllipsisOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaFileInvoice, FaRoute } from "react-icons/fa";

import styles from "./mainStack.module.css";
import { LogoIcon } from "../../assets/icons/logo";
import { createElement, useEffect, useState } from "react";
import { logout } from "../../api/auth";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import {
  BLF,
  BLFs,
  Client,
  Clients,
  Payment,
  Payments,
  Routes,
  RouteDetail,
  RMAs,
  RMA,
} from "../../pages";
import NotificationItem from "../../components/NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getNotificationsThunk } from "../../core/notificationSlice";
import { INotification } from "../../api/notifications";
const { Header, Content, Sider } = Layout;

function MainStack() {
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  // page state
  const [collapsed, setCollapsed] = useState(false);

  // Handler
  const errorNotification = (msg: string) => {
    message.error(msg);
  };

  // Effects

  useEffect(() => {
    dispatch(getNotificationsThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ minHeight: "100vh" }}
          theme="light"
          breakpoint="xl"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            } else {
              setCollapsed(false);
            }
          }}
        >
          <Link to="/">
            <div className={styles.logo}>
              <LogoIcon />
              {!collapsed && (
                <Title level={4} style={{ color: "#f0f0f0", margin: "auto" }}>
                  DigiusCRM
                </Title>
              )}
            </div>
          </Link>
          <Menu mode="inline" selectedKeys={[pathname]}>
            <Menu.Item
              key="/"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<HomeOutlined style={{ fontSize: 22 }} />}
            >
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item
              key="/clients"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<TeamOutlined style={{ fontSize: 22 }} />}
            >
              <Link to="/clients">Clients</Link>
            </Menu.Item>
            <Menu.Item
              key="/blfs"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<BookOutlined style={{ fontSize: 22 }} />}
            >
              <Link to="/blfs">BL/F</Link>
            </Menu.Item>
            <Menu.Item
              key="/payments"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<FileDoneOutlined style={{ fontSize: 22 }} />}
            >
              <Link to="/payments">Paiements</Link>
            </Menu.Item>
            <Menu.Item
              key="/routes"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<FaRoute style={{ fontSize: 22 }} />}
            >
              <Link to="/routes">Itinéraires</Link>
            </Menu.Item>
            <Menu.Item
              key="/rmas"
              style={{
                fontSize: 18,
                backgroundColor: "transparent",
              }}
              icon={<FaFileInvoice style={{ fontSize: 22 }} />}
            >
              <Link to="/rmas">RMA</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              paddingRight: 14,
              backgroundColor: "#001529",
              display: "flex",
              alignItems: "center",
            }}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.trigger,
              onClick: () => setCollapsed((prevState) => !prevState),
            })}
            <div style={{ flex: 1 }} />
            <Dropdown
              overlay={
                <Menu style={{ maxHeight: "30vh", overflow: "scroll" }}>
                  {notifications?.map((notif) => (
                    <NotificationItem
                      key={notif?.objectId}
                      notif={notif}
                      linkTo={getNotificationLinkUrl(notif)}
                      title={`Un ${notif?.for} est ajouté`}
                      icon={<EllipsisOutlined />}
                    />
                  ))}
                </Menu>
              }
              placement="bottomLeft"
            >
              <Badge count={notifications?.length}>
                <Button
                  type="dashed"
                  shape="circle"
                  icon={<NotificationOutlined />}
                />
              </Badge>
            </Dropdown>

            <div style={{ width: 8 }} />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="10"
                    icon={<LogoutOutlined />}
                    onClick={() =>
                      logout()
                        .then(() => window.location.reload())
                        .catch((err) => errorNotification(err.message))
                    }
                  >
                    Log Out
                  </Menu.Item>
                </Menu>
              }
              placement="bottomCenter"
            >
              <Button type="dashed" shape="circle" icon={<UserOutlined />} />
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              minHeight: 280,
              backgroundColor: "#fff",
            }}
          >
            <Switch>
              <Route exact path="/clients" component={Clients} />
              <Route exact path="/clients/:objectId" component={Client} />
              <Route exact path="/blfs" component={BLFs} />
              <Route exact path="/blfs/:objectId" component={BLF} />
              <Route exact path="/payments" component={Payments} />
              <Route exact path="/payments/:objectId" component={Payment} />
              <Route exact path="/routes" component={Routes} />
              <Route exact path="/routes/:objectId" component={RouteDetail} />
              <Route exact path="/rmas" component={RMAs} />
              <Route exact path="/rmas/:objectId" component={RMA} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default MainStack;

//  helpers
function getNotificationLinkUrl(notif: INotification): string {
  switch (notif.for) {
    case "Client":
      return `/clients/${notif?.objectId}`;
    case "Blf":
      return `/blfs/${notif?.objectId}`;
    default:
      break;
  }
}
