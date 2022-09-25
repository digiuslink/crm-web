import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  PageHeader,
  Tag,
  Table,
  Row,
  Col,
  Avatar,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { deleteNotif } from "../../api/notifications";
import { appMap } from "../../components/AppMap";
import { EditBlfdrawer } from "../../containers/BLFs/EditBlfdrawer";
import { getNotificationsThunk } from "../../core/notificationSlice";
import { RootState } from "../../store";
import { getBlfThunk, IBlf } from "./blfSlice";

const columns = [
  {
    title: "Désignation",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Prix (Da)",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Quantité",
    dataIndex: "qte",
    key: "qte",
  },
  {
    title: "Remise (%)",
    dataIndex: "remise",
    key: "remise",
  },
];

export function BLF() {
  const dispatch = useDispatch();
  const { objectId } = useParams() as any;
  const { blf: loadedBlf } = useSelector((state: RootState) => state.blf);
  const [visible, setVisible] = useState(false); // Edit drawer state
  const [blf, setBlf] = useState<IBlf>();

  useEffect(() => {
    (async function () {
      deleteNotif({ for: "Blf", objectId })
        .then(() => {
          dispatch(getNotificationsThunk());
        })
        .catch(() => {});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBlf(loadedBlf);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedBlf]);

  // useEffect(() => {
  //   setBlf(blfs?.find((blf) => blf?.objectId === objectId));
  // }, [blfs, objectId]);

  useEffect(() => {
    dispatch(getBlfThunk(objectId));

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
          title="BL/F"
          subTitle={blf?.client?.fullName}
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
                <Col>{blf?.addedBy?.username}</Col>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              {moment(blf?.blfDate?.iso).format("DD/MM/YYYY")}
            </Descriptions.Item>

            {blf?.gps && (
              <Descriptions.Item label="GPS">
                <Typography.Link onClick={() => appMap({ gps: blf?.gps })}>
                  {`${blf?.gps?.latitude}, ${blf?.gps?.longitude}`}
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
            dataSource={blf?.blfItems}
            columns={columns}
            pagination={false}
            scroll={{ y: "35vh" }}
          />
          <div style={{ height: 24 }} />
          <Descriptions
            title=""
            // layout="vertical"
            bordered
            size="middle"
            labelStyle={{
              fontWeight: "bold",
              backgroundColor: "#F0F2F5",
            }}
          >
            <Descriptions.Item label="Total">
              <Tag color="geekblue" style={{ fontSize: 18 }}>
                {blf?.total} Da
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Remise">
              <Tag color="error" style={{ fontSize: 18 }}>
                {blf?.remise} %
              </Tag>
            </Descriptions.Item>
            {/* <Descriptions.Item label="Date">
              <Tag color="geekblue" style={{ fontSize: 16 }}>
                {moment(blf?.blfDate?.iso).format("DD/MM/YYYY")}
              </Tag>
            </Descriptions.Item> */}
          </Descriptions>
        </div>
      </div>
      {visible && (
        <EditBlfdrawer
          visible={visible}
          onClose={() => setVisible(false)}
          blf={blf}
        />
      )}
    </>
  );
}
