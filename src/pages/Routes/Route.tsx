import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  message,
  PageHeader,
  Row,
  Tag,
  Typography,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getRouteDetail, IRoute } from "../../api/routes";
import { appMap } from "../../components/AppMap";
import { EditRouteDrawer } from "../../containers/Routes/EditRouteDrawer";

const columns = [
  {
    title: "Client",
    dataIndex: "client",
    key: "client",
    render: (client) => {
      return <Typography.Text strong>{client.fullName}</Typography.Text>;
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => {
      return <Typography.Text>{type?.name}</Typography.Text>;
    },
  },
  {
    title: "Visité?",
    dataIndex: "isVisited",
    key: "isVisited",
    width: 75,
    render: (isVisited) => {
      return isVisited ? (
        <Tag color="green">OUI</Tag>
      ) : (
        <Tag color="orange">NON</Tag>
      );
    },
  },
  {
    title: "Etat",
    dataIndex: "clientState",
    key: "clientState",
    render: (clientState) => {
      return <Typography.Text>{clientState?.name}</Typography.Text>;
    },
  },
  {
    title: "gps",
    dataIndex: "gps",
    key: "gps",
    width: 90,
    render: (gps) => {
      return gps ? (
        <Typography.Link onClick={() => appMap({ gps })} ellipsis>
          {`${gps?.latitude}, ${gps?.longitude}`}
        </Typography.Link>
      ) : (
        <Typography.Text type="secondary" ellipsis>
          non fourni
        </Typography.Text>
      );
    },
  },

  {
    // TODO Add note Logic
    title: "note",
    dataIndex: "note",
    key: "note",
    render: (note) => {
      return <Typography.Text>Some note goes here</Typography.Text>;
    },
  },
];

export function RouteDetail() {
  // Page State
  const [editRouteVisible, setEditRouteVisible] = useState(false);
  const [fetchRouteLoading, setFetchRouteLoading] = useState(false);
  // Data
  const { objectId } = useParams() as any;
  const [routeDetail, setRouteDetail] = useState<IRoute | undefined>();

  // Helpers
  const fetchRouteDetail = async () => {
    try {
      setFetchRouteLoading(true);
      const result = await getRouteDetail(objectId);
      setRouteDetail(result);
      setFetchRouteLoading(false);
    } catch (err) {
      message.error("Oopss..!");
    }
  };
  // side Effects
  useEffect(() => {
    fetchRouteDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <PageHeader
          title="Itinéraire"
          subTitle={moment(routeDetail?.scheduledDate).format("DD/MM/yyyy")}
          ghost={false}
          onBack={() => window.history.back()}
          extra={[
            <Button
              key="2"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setEditRouteVisible(true);
              }}
            >
              Modifier
            </Button>,
          ]}
        />
        <div
          style={{
            margin: 24,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Descriptions
            title="Détail"
            // layout="vertical"
            bordered
            size="small"
            labelStyle={{
              fontWeight: "bold",
              backgroundColor: "#F0F2F5",
            }}
          >
            <Descriptions.Item label="Ajouter par">
              <Row gutter={6} style={{ alignItems: "center" }}>
                <Col>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890FF" }}
                  />
                </Col>
                <Col>{routeDetail?.addedBy?.username}</Col>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Assigné à">
              <Row gutter={6} style={{ alignItems: "center" }}>
                <Col>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890FF" }}
                  />
                </Col>
                <Col>{routeDetail?.assignedTo?.username}</Col>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              {moment(routeDetail?.scheduledDate).format("DD/MM/YYYY")}
            </Descriptions.Item>

            <Descriptions.Item label="Itinéraire">
              {routeDetail?.routeFactory?.name}
            </Descriptions.Item>

            <Descriptions.Item label="Localité">
              {routeDetail?.locality.map((item) => (
                <Tag color="blue">{item}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Etat">
              <Typography.Text strong>
                {routeDetail?.routeState?.name}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
          {routeDetail?.gps && (
            <Descriptions.Item label="GPS">
              <Typography.Link
                onClick={() => appMap({ gps: routeDetail?.gps })}
              >
                {`${routeDetail?.gps?.latitude}, ${routeDetail?.gps?.longitude}`}
              </Typography.Link>
            </Descriptions.Item>
          )}
          <div style={{ height: 24 }} />
          <Descriptions
            title="visites"
            // layout="vertical"
            bordered
            size="middle"
            labelStyle={{
              fontWeight: "bold",
              backgroundColor: "#F0F2F5",
            }}
          />
          <Table
            pagination={false}
            size="small"
            columns={columns}
            loading={fetchRouteLoading}
            dataSource={routeDetail?.visits}
            scroll={{ y: "35vh", x: 20 }}
          />
        </div>
      </div>
      {editRouteVisible && (
        <EditRouteDrawer
          visible={editRouteVisible}
          onClose={() => setEditRouteVisible(false)}
          routeDetail={routeDetail}
          getRouteDetail={() => fetchRouteDetail()}
        />
      )}
    </>
  );
}
