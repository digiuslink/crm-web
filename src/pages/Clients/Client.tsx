import {
  DotChartOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  PageHeader,
  Spin,
  Badge,
  Switch,
  message,
  Tag,
  Typography,
  Avatar,
  Row,
  Col,
  List,
} from "antd";
import moment from "moment";
import { memo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getClientFinance } from "../../api/client";
import { deleteNotif } from "../../api/notifications";
import AppError from "../../components/AppError";
import { appMap } from "../../components/AppMap";
import { EditClientDrawer } from "../../containers/Clients/EditClientDrawer";
import { getNotificationsThunk } from "../../core/notificationSlice";
import { RootState } from "../../store";
import { getBlfsThunk } from "../BLFs/blfSlice";
import { getPaymentsThunk } from "../Payments/paymentSlice";
import {
  getClientThunk,
  setGetClientError,
  setVerifiedThunk,
} from "./clientSlice";

export const Client = memo(() => {
  const { objectId } = useParams() as any;
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [finance, setFinance] = useState<{ turnover: number; debt: number }>({
    turnover: 0,
    debt: 0,
  });

  const {
    isVerified,
    isVerifiedChanged,
    client,
    clientEdited,
    getClientError,
  } = useSelector((state: RootState) => state.client);
  const { blfs, getBlfsLoading } = useSelector((state: RootState) => state.blf);
  const { payments } = useSelector((state: RootState) => state.payment);

  const loading = clientEdited === "loading";
  // State
  const fetch = async () => {
    dispatch(setGetClientError(false));
    dispatch(getClientThunk(objectId));
    const { turnover, debt } = await getClientFinance(objectId);
    setFinance({ turnover, debt });
    dispatch(
      getBlfsThunk({
        filter: { pagination: { page: 1, pageSize: 5 }, client: objectId },
      })
    );
    dispatch(
      getPaymentsThunk({
        filter: { pagination: { page: 1, pageSize: 5 }, client: objectId },
      })
    );
  };
  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId]);
  useEffect(() => {
    if (isVerifiedChanged === "changed")
      message.success("Modifié avec succès ");
    else if (isVerifiedChanged === "error") message.error("Opps..!");
  }, [isVerifiedChanged]);

  useEffect(() => {
    (async function () {
      deleteNotif({ for: "Client", objectId })
        .then(() => {
          dispatch(getNotificationsThunk());
        })
        .catch(() => {});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {getClientError && <AppError onRetry={fetch} />}
        {!getClientError && (
          <>
            <PageHeader
              title={
                !loading ? (
                  client?.fullName
                ) : (
                  <Spin style={{ paddingRight: 2 }} />
                )
              }
              subTitle={!loading && client?.wcom}
              ghost={false}
              // style={{ backgroundColor: "#E6F7FF" }}
              onBack={() => window.history.back()}
              extra={[
                <Switch
                  key="1"
                  size="small"
                  checkedChildren="vérifié"
                  unCheckedChildren="vérifié"
                  loading={isVerifiedChanged === "loading"}
                  checked={isVerified}
                  onChange={(checked) => {
                    dispatch(
                      setVerifiedThunk({
                        objectId: client?.objectId,
                        isVerified: checked,
                      })
                    );
                  }}
                />,
                <Button
                  key="2"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                  loading={loading}
                >
                  Modifier
                </Button>,
              ]}
            />
            <div style={{ margin: 24 }}>
              <Descriptions
                title="État client "
                // layout="vertical"
                bordered
                size="middle"
                labelStyle={{
                  fontWeight: "bold",
                  backgroundColor: "#F0F2F5",
                }}
              >
                <Descriptions.Item label="Ajouter par" span={1}>
                  {client?.addedBy?.username}
                </Descriptions.Item>
                <Descriptions.Item label="vérifié? ">
                  {isVerified ? (
                    <Badge status="success" text="Oui" />
                  ) : (
                    <Badge status="warning" text="Non" />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Category ">
                  {client?.category}
                </Descriptions.Item>
                <Descriptions.Item label="Etat ">
                  {client?.clientState}
                </Descriptions.Item>
                <Descriptions.Item label="Assigné à ">
                  <Row gutter={6} style={{ alignItems: "center" }}>
                    <Col>
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1890FF" }}
                      />
                    </Col>
                    <Col>{client?.assignedTo?.username}</Col>
                  </Row>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ height: 24 }} />
              <Descriptions
                title="Informations de contact"
                labelStyle={{
                  fontWeight: "bold",
                  backgroundColor: "#F0F2F5",
                }}
                contentStyle={{ color: "#454545" }}
                // layout="vertical"
                bordered
                size="small"
              >
                <Descriptions.Item label="Tel 01">
                  {client?.tel_1}
                </Descriptions.Item>
                <Descriptions.Item label="Tel 02">
                  {client?.tel_2}
                </Descriptions.Item>
                <Descriptions.Item label="Tel 03">
                  {client?.tel_3}
                </Descriptions.Item>
                <Descriptions.Item label="Wilaya">
                  {client?.wilaya}
                </Descriptions.Item>
                <Descriptions.Item label="Commune">
                  {client?.commune}
                </Descriptions.Item>
                <Descriptions.Item label="Adresse">
                  {client?.address}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {client?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Facebook">
                  {client?.facebook}
                </Descriptions.Item>
                <Descriptions.Item label="GPS">
                  <Typography.Link onClick={() => appMap({ gps: client?.gps })}>
                    {`${client?.gps?.latitude}, ${client?.gps?.longitude}`}
                  </Typography.Link>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ height: 24 }} />
              <Descriptions
                title="Situation financière"
                bordered
                size="middle"
                labelStyle={{
                  fontWeight: "bold",
                  backgroundColor: "#F0F2F5",
                }}
              >
                <Descriptions.Item label="Chifre d`affaire">
                  <Tag color="geekblue">{finance?.turnover} Da</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Créance">
                  <Tag color="error">{finance?.debt} Da</Tag>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ height: 24 }} />

              <Row>
                <Col span={12}>
                  <Descriptions
                    title="BL/F"
                    bordered
                    size="middle"
                    labelStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#F0F2F5",
                    }}
                  />
                  <div>
                    <List
                      loading={getBlfsLoading === "loading"}
                      dataSource={blfs}
                      footer={
                        <Link to={`/blfs?client=${objectId}`}>voir plus</Link>
                      }
                      renderItem={(item) => {
                        return (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={<DotChartOutlined />} />}
                              title={
                                <Link to={`/blfs/${item.objectId}`}>
                                  Date:
                                  {moment(item?.blfDate?.iso).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Link>
                              }
                              description={`total: ${item.total} Da`}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <Descriptions
                    title="Paiment"
                    bordered
                    size="middle"
                    labelStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#F0F2F5",
                    }}
                  />
                  <div>
                    <List
                      dataSource={payments}
                      renderItem={(item) => {
                        return (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={<DotChartOutlined />} />}
                              title={
                                <Link to={`/payments/${item.objectId}`}>
                                  {moment(item.paymentDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Link>
                              }
                              description={`montant: ${item.amount} Da`}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
      {openDrawer && (
        <EditClientDrawer
          onClose={() => {
            setOpenDrawer(false);
          }}
          visible={openDrawer}
          client={client}
        />
      )}
    </>
  );
});
