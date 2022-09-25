import {
  CheckCircleFilled,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  PageHeader,
  Row,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRMAs } from "../../api/rma";
import { ISettingsParm } from "../../api/routes";
import { AddRMADrawer } from "../../containers/RMA/AddRMADrawer";
import { RMASettingsDrawer } from "../../containers/RMA/RMASettingsDrawer";
import { IClient } from "../Clients/IClient";

export interface IRMA {
  objectId?: string;
  rmaDate: Date;
  client: IClient;
  via: ISettingsParm;
  products: {
    designation: string;
    qte?: number;
    rmaReason: ISettingsParm;
  }[];
  addedBy?: { username?: string };
  gps?: any;
}

// const rmas: IRMA[] = [
//   {
//     products: [
//       {
//         designation: "USB-04",
//         qte: 2,
//         rmaReason: { name: "Autre" },
//       },
//     ],
//     via: { name: "Standar" },

//     rmaDate: new Date(),
//     client: { fullName: "lient name", assignedTo: { username: "user" } },
//   },
//   {
//     products: [
//       {
//         designation: "USB-04",
//         qte: 2,
//         rmaReason: { name: "Autre" },
//       },
//     ],

//     via: { name: "Standar" },
//     rmaDate: new Date(),
//     client: { fullName: "lient name", assignedTo: { username: "user" } },
//   },
// ];
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
            <Link to={`rmas/${rec?.objectId}`}>
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
  // {
  //   title: "Motif",
  //   dataIndex: "reason",
  //   key: "reason",
  //   render: (reason: any) => {
  //     return (
  //       <div
  //         style={{
  //           display: "flex",
  //           maxWidth: 0,
  //           maxHeight: 0,
  //           position: "absolute",
  //           top: 0,
  //         }}
  //       >
  //         <Typography.Text style={{ fontSize: 19, color: "#353535" }}>
  //           {reason?.name}
  //         </Typography.Text>
  //       </div>
  //     );
  //   },
  // },
  {
    title: "Via commercial",
    dataIndex: "via",
    key: "via",
    render: (reason: any) => {
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
          <Typography.Text style={{ fontSize: 19, color: "#353535" }}>
            {reason?.name}
          </Typography.Text>
        </div>
      );
    },
  },
  {
    title: "Date",
    dataIndex: "rmaDate",
    key: "rmaDate",
    // width: 150,
    render: (rmaDate: any) => {
      return (
        <Typography.Text style={{ fontSize: 16 }}>
          {moment(rmaDate).format("DD/MM/YYYY")}
        </Typography.Text>
      );
    },
  },
];

/* //!========================= Component =========================!// */

export function RMAs() {
  // ! Page state
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [addRMADrawerVisible, setAddRMADrawerVisible] = useState(false);

  // ! Data State
  const [rmas, setRmas] = useState<IRMA[]>();

  // ! Helpers
  const fetchRMAs = async () => {
    try {
      setRmas(await getRMAs());
    } catch (err) {
      console.log(err);
      message.error("Opps..!", 3);
    }
  };
  // ! SidEffects
  useEffect(() => {
    fetchRMAs();
  }, []);
  return (
    <>
      <div>
        <PageHeader
          title="RMA"
          subTitle="Retour Produits"
          ghost={false}
          extra={[
            <Button
              key="1"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddRMADrawerVisible(true);
              }}
            >
              Ajouter
            </Button>,

            <Tooltip title="Options" key="3">
              <Button
                shape="circle"
                icon={<SettingOutlined />}
                onClick={() => {
                  setSettingsDrawerVisible(true);
                }}
              />
            </Tooltip>,
          ]}
        />
        <Table
          columns={columns}
          dataSource={rmas}
          size="small"
          onRow={(data, index) => {
            return {
              onDoubleClick: () => {},
            };
          }}
        />
      </div>
      {settingsDrawerVisible && (
        <RMASettingsDrawer
          visible={settingsDrawerVisible}
          onClose={() => {
            setSettingsDrawerVisible(false);
          }}
        />
      )}
      {addRMADrawerVisible && (
        <AddRMADrawer
          visible={addRMADrawerVisible}
          onClose={() => setAddRMADrawerVisible(false)}
          fetch={fetchRMAs}
        />
      )}
    </>
  );
}
