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
  Col,
  PageHeader,
  Row,
  Table,
  Tooltip,
} from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import AppError from "../../components/AppError";
import { AddClientDrawer } from "../../containers/Clients/AddClientDrawer";
import { ClientsSettingsDrawer } from "../../containers/Clients/ClientsSettingsDrawer";
import { FilterClientsDrawer } from "../../containers/Clients/FilterClientsDrawer";
import { RootState } from "../../store";
import { getClientsThunk } from "./clientsSlice";

const columns = [
  // {
  //   title: "id",
  //   dataIndex: "objectId",
  //   key: "id",
  //   render: (id: string) => <Link to={`clients/${id}`}>{id}</Link>,
  // },
  // {
  //   title: "WCOM ID",
  //   dataIndex: "wcom",
  //   key: "wcom",
  // },
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
          key={rec.objectId}
        >
          <Col>
            <Link to={`clients/${rec.objectId}`}>{fullName}</Link>
          </Col>
          {rec.isVerified && (
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
        assignedTo?.username && (
          <Row gutter={6} style={{ alignItems: "center" }} key={rec.objectId}>
            <Col>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#666" }}
              />
            </Col>
            <Col>{assignedTo?.username}</Col>
          </Row>
        )
      );
    },
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Wilaya",
    dataIndex: "wilaya",
    key: "wilaya",
  },
  {
    title: "Numéro de téléphone",
    dataIndex: "tel_1",
    key: "tel_1",
  },
  // {
  //   title: "Tel-02",
  //   dataIndex: "tel_2",
  //   key: "tel_2",
  // },
  // {
  //   title: "Tel-02",
  //   dataIndex: "tel_3",
  //   key: "tel_3",
  // },
];

export const Clients = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { clients, error, loading } = useSelector(
    (state: RootState) => state.clients
  );
  // Page State
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openConfigsDrawer, setOpenConfigsDrawer] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  // State
  const { clientFiltersCount, clientFilter } = useSelector(
    (state: RootState) => state.app
  );
  // Handler
  const handleAddDrawerClosed = () => {
    setOpenAddDrawer(false);
  };

  // SideEffects
  useEffect(() => {
    dispatch(getClientsThunk({ filter: clientFilter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        <PageHeader
          title="Clients"
          subTitle="Manager votre clients "
          ghost={false}
          // style={{ backgroundColor: "#E6F7FF" }}
          extra={[
            <Button
              key="1"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenAddDrawer(true)}
            >
              Ajouter
            </Button>,
            <Tooltip title="Filter" key="2">
              <Badge count={clientFiltersCount}>
                <Button
                  shape="circle"
                  icon={<FilterOutlined />}
                  onClick={() => setOpenFilterDrawer(true)}
                />
              </Badge>
            </Tooltip>,
            <Tooltip title="Paramètres" key="3">
              <Button
                shape="circle"
                icon={<SettingOutlined />}
                onClick={() => setOpenConfigsDrawer(true)}
              />
            </Tooltip>,
          ]}
        />
        {error ? (
          <AppError
            onRetry={() => dispatch(getClientsThunk({ filter: clientFilter }))}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={clients}
            size="middle"
            loading={loading}
            onRow={(data) => {
              return {
                onDoubleClick: () => history.push(`clients/${data.objectId}`),
              };
            }}
          />
        )}
      </div>
      {openAddDrawer && (
        <AddClientDrawer
          visible={openAddDrawer}
          onClose={handleAddDrawerClosed}
        />
      )}
      {openConfigsDrawer && (
        <ClientsSettingsDrawer
          onClose={() => setOpenConfigsDrawer(false)}
          visible={openConfigsDrawer}
        />
      )}

      {openFilterDrawer && (
        <FilterClientsDrawer
          visible={openFilterDrawer}
          onClose={() => setOpenFilterDrawer(false)}
        />
      )}
    </>
  );
};
