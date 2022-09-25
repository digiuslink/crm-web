import {
  CheckCircleFilled,
  FileDoneOutlined,
  FilterOutlined,
  PlusOutlined,
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
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { RootState } from "../../store";
import { getBlfsThunk } from "./blfSlice";
import { AddBlfdrawer } from "../../containers/BLFs/AddBlfdrawer";
import FilterBlfsDrawer from "../../containers/BLFs/FilterBlfsDrawer";
import PackDrawer from "../../containers/BLFs/PackDrawer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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
            <Link to={`blfs/${rec?.objectId}`}>
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
    // width: 200,
    render: (assignedTo: any, rec: any) => {
      return (
        rec?.client?.assignedTo?.username && (
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
                {rec?.client?.assignedTo?.username}
              </Typography.Text>
            </Col>
          </Row>
        )
      );
    },
  },
  {
    title: "Montant",
    dataIndex: "total",
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
          <Badge.Ribbon text="Da" color="blue">
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
        <Typography.Text style={{ fontSize: 16 }}>
          {moment(blfDate.iso).format("DD/MM/YYYY")}
        </Typography.Text>
      );
    },
  },
];

export interface IPagination {
  page: number;
  pageSize?: number;
}

export function BLFs() {
  const query = useQuery();
  const dispatch = useDispatch();
  const clientId = query.get("client");

  const { blfs, getBlfsLoading, count } = useSelector(
    (state: RootState) => state.blf
  );
  const { blfFiltersCount, blfFilter } = useSelector(
    (state: RootState) => state.app
  );

  const [addBlfDrawerVisible, setAddBlfDrawerVisible] = useState(false);
  const [filterBlfDrawerVisible, setFilterBlfDrawerVisible] = useState(false);
  const [packDrawerVisible, setPackDrawerVisible] = useState(false);

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (clientId) {
      dispatch(
        getBlfsThunk({ filter: { pagination, ...blfFilter, client: clientId } })
      );
    } else {
      dispatch(getBlfsThunk({ filter: { pagination, ...blfFilter } }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, blfFilter]);

  return (
    <>
      <div>
        <PageHeader
          title="BL/F"
          subTitle="Factures et Bon de Livraison "
          ghost={false}
          extra={[
            <Button
              key="1"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddBlfDrawerVisible(true)}
            >
              Ajouter
            </Button>,
            <Tooltip title="Filter" key="2">
              <Badge count={blfFiltersCount}>
                <Button
                  shape="circle"
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setFilterBlfDrawerVisible(true);
                  }}
                />
              </Badge>
            </Tooltip>,
            <Tooltip title="Packs" key="3">
              <Button
                shape="circle"
                icon={<FileDoneOutlined />}
                onClick={() => setPackDrawerVisible(true)}
              />
            </Tooltip>,
          ]}
        />
        <Table
          columns={columns}
          dataSource={blfs}
          size="small"
          loading={getBlfsLoading === "loading"}
          pagination={{
            total: count,
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
          }}
          onRow={(data, index) => {
            return {
              onDoubleClick: () => {},
            };
          }}
        />
      </div>
      {addBlfDrawerVisible && (
        <AddBlfdrawer
          visible={addBlfDrawerVisible}
          onClose={() => setAddBlfDrawerVisible(false)}
        />
      )}
      {filterBlfDrawerVisible && (
        <FilterBlfsDrawer
          visible={filterBlfDrawerVisible}
          onClose={() => {
            setFilterBlfDrawerVisible(false);
          }}
        />
      )}
      {packDrawerVisible && (
        <PackDrawer
          visible={packDrawerVisible}
          onClose={() => setPackDrawerVisible(false)}
        />
      )}
    </>
  );
}
