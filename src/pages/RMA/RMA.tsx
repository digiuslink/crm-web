import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  PageHeader,
  Table,
  Row,
  Col,
  Avatar,
  Typography,
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { appMap } from "../../components/AppMap";
import { IRMA } from "../../pages/RMA/RMAs";
import { getRMA } from "../../api/rma";
import { EditRMADrawer } from "../../containers/RMA/EditRMAdrawer";

const columns = [
  {
    title: "Désignation",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Motif de retour",
    dataIndex: "rmaReason",
    key: "price",
    render: (rmaReason) => {
      return <Typography.Text>{rmaReason.name}</Typography.Text>;
    },
  },
  {
    title: "Quantité",
    dataIndex: "qte",
    key: "qte",
  },
];

export function RMA() {
  const { objectId } = useParams() as any;
  const [visible, setVisible] = useState(false); // Edit drawer state
  const [rma, setRma] = useState<IRMA>();
  const [rmaLoading, setRmaLoading] = useState(false);

  const fetchRMA = async () => {
    try {
      setRmaLoading(true);
      setRma(await getRMA(objectId));
      setRmaLoading(false);
    } catch (err) {
      setRmaLoading(false);
      message.error("Opps..!", 3);
    }
  };
  useEffect(() => {
    fetchRMA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId]);
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
          title="RMA"
          subTitle={rmaLoading ? "loading..." : rma?.client?.fullName}
          ghost={false}
          onBack={() => window.history.back()}
          extra={[
            <Button
              key="2"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setVisible(true);
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
                <Col>{rma?.addedBy?.username}</Col>
              </Row>
            </Descriptions.Item>
            <Descriptions.Item label="Asigné à">
              <Row gutter={6} style={{ alignItems: "center" }}>
                <Col>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890FF" }}
                  />
                </Col>
                <Col>{rma?.client?.assignedTo}</Col>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              {moment(rma?.rmaDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="VIA COMMERCIAL">
              {rma?.via?.name}
            </Descriptions.Item>

            {rma?.gps && (
              <Descriptions.Item label="GPS">
                <Typography.Link onClick={() => appMap({ gps: rma?.gps })}>
                  {`${rma?.gps?.latitude}, ${rma?.gps?.longitude}`}
                </Typography.Link>
              </Descriptions.Item>
            )}
          </Descriptions>
          <div style={{ height: 12 }} />
          <Descriptions
            title="Articles"
            // layout="vertical"
            bordered
            size="middle"
            labelStyle={{
              fontWeight: "bold",
              backgroundColor: "#F0F2F5",
            }}
          />
          <Table
            dataSource={rma?.products}
            columns={columns}
            pagination={false}
            scroll={{ y: "35vh" }}
          />
        </div>
      </div>
      {visible && (
        <EditRMADrawer
          visible={visible}
          onClose={() => setVisible(false)}
          rma={rma}
          fetch={fetchRMA}
        />
      )}
    </>
  );
}
