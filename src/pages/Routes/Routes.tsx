import {
  UserOutlined,
  SettingOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  PageHeader,
  Row,
  Tooltip,
  Typography,
  Table,
  Tag,
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRoutes, IRoute } from "../../api/routes";
import { AddRouteDrawer } from "../../containers/Routes/AddRouteDrawer";
import { ConfigsDrawer } from "../../containers/Routes/ConfigsDrawer";
import RouteFactoryDrawer from "../../containers/Routes/RouteFactoryDrawer";
import { setRouteFilters } from "../../core/appSlice";
import { RootState } from "../../store";
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Assigné à ",
    dataIndex: "assignedTo",
    key: "assignedTo",
    width: "25%",
    render: (assignedTo: any, rec: IRoute) => {
      return (
        rec?.assignedTo?.username && (
          <Row
            gutter={6}
            style={{ alignItems: "center" }}
            key={rec?.assignedTo?.objectId}
          >
            <Col>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890FF" }}
              />
            </Col>
            <Col>
              <Typography.Text style={{ fontSize: 18, color: "#666" }}>
                <Link to={`/routes/${rec.objectId}`}>
                  {rec?.assignedTo?.username}
                </Link>
              </Typography.Text>
            </Col>
          </Row>
        )
      );
    },
  },
  {
    title: "Date",
    dataIndex: "scheduledDate",
    key: "scheduledDate",
    width: 150,
    render: (scheduledDate: any) => {
      return (
        <Typography.Text style={{ fontSize: 16 }}>
          {moment(scheduledDate).format("DD/MM/YYYY")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Etat",
    dataIndex: "routeState",
    key: "routeState",
    render: (routeState) => {
      return <Typography.Text strong>{routeState?.name}</Typography.Text>;
    },
  },
  {
    title: "Localité",
    dataIndex: "locality",
    key: "locality",
    render: (locality) => {
      return (
        <Row>
          {locality.map((item) => (
            <Tag color="blue">{item}</Tag>
          ))}
        </Row>
      );
    },
  },
];

export function Routes() {
  const dispatch = useDispatch();
  // Page State
  const [addRouteDrawerVisible, setAddRouteDrawerVisible] = useState(false);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [routeFactoryVisible, setRouteFactoryVisible] = useState(false);

  const [routesLoading, setRoutesLoading] = useState(false);

  // Filter State
  const { routesFilter } = useSelector((state: RootState) => state.app);

  // Data State
  const [routes, setRoutes] = useState<IRoute[]>([]);
  // Helpers

  const fetchRoutes = async () => {
    try {
      setRoutesLoading(true);
      const _routes = await getRoutes(routesFilter);
      setRoutes(_routes);
      setRoutesLoading(false);
    } catch (err) {
      message.error("Opps..!");
    }
  };

  // useEffect(() => {
  //   dispatch(
  //     setRouteFilters({
  //       routesFilter,

  //     })
  //   );

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Side Effects
  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesFilter]);

  return (
    <>
      <PageHeader
        title="Itinéraires"
        subTitle={moment(new Date()).format("DD/MM/yyyy")}
        extra={[
          <RangePicker
            format={"DD/MM/YYYY"}
            value={[
              moment(routesFilter.startDate),
              moment(routesFilter.endDate),
            ]}
            onChange={(values) => {
              if (values !== null) {
                const [startDate, endDate] = values;
                dispatch(
                  setRouteFilters({
                    ...routesFilter,
                    startDate: startDate.toDate(),
                    endDate: endDate.toDate(),
                  })
                );
              } else {
                dispatch(
                  setRouteFilters({
                    ...routesFilter,
                    startDate: undefined,
                    endDate: undefined,
                  })
                );
              }
            }}
          />,
          <Tooltip
            title="Ajouter un itinéraires"
            placement="bottomLeft"
            key="blal"
          >
            <Button
              type="primary"
              onClick={() => {
                setAddRouteDrawerVisible(true);
              }}
            >
              Ajouter
            </Button>
          </Tooltip>,
          <Tooltip title="Configs" placement="bottom">
            <SettingOutlined
              style={{ fontSize: 18 }}
              onClick={() => {
                setConfigDrawerVisible(true);
              }}
            />
          </Tooltip>,
          <Tooltip title="Itinéraires" placement="bottomLeft" key="3">
            <Button
              shape="circle"
              icon={<FileDoneOutlined />}
              onClick={() => setRouteFactoryVisible(true)}
            />
          </Tooltip>,
        ]}
      />
      <Table
        columns={columns}
        size="small"
        dataSource={routes}
        loading={routesLoading}
      />
      {addRouteDrawerVisible && (
        <AddRouteDrawer
          visible={addRouteDrawerVisible}
          fetchRoutes={fetchRoutes}
          onClose={() => {
            setAddRouteDrawerVisible(false);
          }}
        />
      )}
      {configDrawerVisible && (
        <ConfigsDrawer
          visible={configDrawerVisible}
          onClose={() => setConfigDrawerVisible(false)}
        />
      )}
      {routeFactoryVisible && (
        <RouteFactoryDrawer
          visible={routeFactoryVisible}
          onClose={() => {
            setRouteFactoryVisible(false);
          }}
        />
      )}
    </>
  );
}
