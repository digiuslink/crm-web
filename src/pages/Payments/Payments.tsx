import {
  CheckCircleFilled,
  FilterOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  PageHeader,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { RootState } from "../../store";
import { IPagination } from "../BLFs/BLFs";
import { getPaymentsThunk } from "./paymentSlice";
import { AddPaymentModal } from "../../containers/Payments/AddPaymentModal";
import { PaimentSettingsDrawer } from "../../containers/Payments/PaimentSettingsDrawer";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const columns = [
  {
    title: "Nom de Client",
    dataIndex: "fullName",
    key: "fullName",
    render: (fullName: string, rec: any) => {
      return (
        <Row
          gutter={3}
          style={{
            alignItems: "center",
          }}
          key={rec?.objectId}
        >
          <Col>
            <Link to={`payments/${rec?.objectId}`}>
              <Typography.Link style={{ fontSize: 18 }}>
                {rec?.client?.fullName}
              </Typography.Link>
            </Link>
          </Col>
          {rec?.isVerified && (
            <Col>
              <CheckCircleFilled style={{ color: "#1890FFaa" }} />
            </Col>
          )}
        </Row>
      );
    },
  },
  {
    title: "Assigné à ",
    dataIndex: "assignedTo",
    key: "assignedTo",
    render: (assignedTo: any, rec: any) => {
      return (
        <Row gutter={6} style={{ alignItems: "center" }} key={rec?.objectId}>
          <Col>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890FF" }}
            />
          </Col>
          <Col>
            <Typography.Text style={{ fontSize: 18, color: "#666" }}>
              {rec.client.assignedTo}
            </Typography.Text>
          </Col>
        </Row>
      );
    },
  },
  {
    title: "Montant",
    dataIndex: "amount",
    key: "amount",
    render: (amount: any) => {
      return (
        <div
          style={{
            display: "flex",
            maxWidth: 0,
            maxHeight: 0,
            position: "absolute",
            top: 0,
          }}
        >
          <Badge.Ribbon text="Da" color="green">
            <Card size="small" style={{ width: 150 }}>
              <Typography.Text
                strong
                style={{ fontSize: 19, color: "#353535" }}
              >
                {amount}
              </Typography.Text>
            </Card>
          </Badge.Ribbon>
        </div>
      );
    },
  },
  {
    title: "Date",
    dataIndex: "blfDate",
    key: "blfDate",
    width: 150,
    render: (blfDate: any) => {
      return (
        <Typography.Text style={{ fontSize: 16, textAlign: "center" }}>
          {moment(blfDate?.iso).format("DD/MM/YYYY")}
        </Typography.Text>
      );
    },
  },
];

/* ========================= Render ========================= */
export function Payments() {
  // const query = useQuery();
  const dispatch = useDispatch();

  // Data
  const { payments, getPaymentsLoading, count } = useSelector(
    (state: RootState) => state.payment
  );

  // Page
  const [addPaymentModalVisible, setAddPaymentModalVisible] = useState(false);
  const [paymentSettignsModalVisible, setPaymentSettignsModalVisible] =
    useState(false);

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });

  // Side Effects
  useEffect(() => {
    dispatch(getPaymentsThunk({ filter: { pagination } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);
  return (
    <>
      <div>
        <PageHeader
          title="Paiements"
          subTitle="Gérer les paiements des clients "
          ghost={false}
          extra={[
            <Button
              key="1"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddPaymentModalVisible(true)}
            >
              Ajouter
            </Button>,
            <Tooltip title="Filter" key="2">
              <Badge>
                <Button
                  shape="circle"
                  icon={<FilterOutlined />}
                  onClick={() => {}}
                />
              </Badge>
            </Tooltip>,
            <Tooltip title="Packs" key="3">
              <Button
                shape="circle"
                icon={<SettingOutlined />}
                onClick={() => {
                  setPaymentSettignsModalVisible(true);
                }}
              />
            </Tooltip>,
          ]}
        />
        <Table
          columns={columns}
          dataSource={payments}
          size="small"
          loading={getPaymentsLoading === "loading"}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: count,
          }}
          onRow={(data, index) => {
            return {
              onDoubleClick: () => {},
            };
          }}
        />
      </div>
      {addPaymentModalVisible && (
        <AddPaymentModal
          visible={addPaymentModalVisible}
          onClose={() => setAddPaymentModalVisible(false)}
        />
      )}
      {paymentSettignsModalVisible && (
        <PaimentSettingsDrawer
          visible={paymentSettignsModalVisible}
          onClose={() => setPaymentSettignsModalVisible(false)}
        />
      )}
    </>
  );
}
