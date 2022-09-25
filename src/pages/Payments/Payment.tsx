/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  message,
  PageHeader,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getPayment, IPayment } from "../../api/payments";
import { appMap } from "../../components/AppMap";
import { UpadatePaymentModal } from "../../containers/Payments/UpdatePaymentModal";

export function Payment() {
  const { objectId } = useParams() as any;
  const [editPaymentModalVisible, setEditPaymentModalVisible] = useState(false);
  const [payment, setPayment] = useState<IPayment>();
  const [paymentLoading, setPaymentLoading] = useState(false);
  // data
  const fetchPayment = async () => {
    try {
      setPaymentLoading(true);
      const _payment = await getPayment(objectId);
      setPayment(_payment);
      setPaymentLoading(false);
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };
  //  Side Efffects
  useEffect(() => {
    fetchPayment();
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
          title="Paiement"
          subTitle={paymentLoading ? <Spin /> : payment?.client?.fullName}
          ghost={false}
          onBack={() => window.history.back()}
          extra={[
            <Button
              key="2"
              type="primary"
              loading={paymentLoading}
              icon={<EditOutlined />}
              onClick={() => {
                setEditPaymentModalVisible(true);
              }}
            >
              Modifier
            </Button>,
          ]}
        />
        <div style={{ margin: 24 }}>
          <Descriptions
            title="Détail"
            // layout="vertical"
            bordered
            size="middle"
            labelStyle={{
              fontWeight: "bold",
              backgroundColor: "#F0F2F5",
            }}
          >
            <Descriptions.Item label="Client">
              <Link to={`/clients/${payment?.client.objectId}`}>
                {payment?.client?.fullName}
              </Link>
            </Descriptions.Item>

            <Descriptions.Item label="Ajouté par">
              <Row gutter={6} style={{ alignItems: "center" }}>
                <Col>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890FF" }}
                  />
                </Col>
                <Col>{payment?.addedBy}</Col>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              {moment(payment?.paymentDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Montan">
              <Tag color="geekblue" style={{ fontSize: 18 }}>
                {payment?.amount} Da
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Type de paiement">
              <Typography.Text>{payment?.paymentType?.name}</Typography.Text>
            </Descriptions.Item>

            {payment?.gps && (
              <Descriptions.Item label="GPS">
                <Typography.Link onClick={() => appMap({ gps: payment?.gps })}>
                  {`${payment?.gps?.latitude}, ${payment?.gps?.longitude}`}
                </Typography.Link>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
      {editPaymentModalVisible && (
        <UpadatePaymentModal
          visible={editPaymentModalVisible}
          payment={payment}
          onClose={() => setEditPaymentModalVisible(false)}
          fetchPayment={fetchPayment}
        />
      )}
    </>
  );
}
