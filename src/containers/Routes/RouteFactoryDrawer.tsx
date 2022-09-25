import {
  ContainerOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Space,
  Tooltip,
  List,
  Avatar,
  Popconfirm,
  message,
} from "antd";
import { useEffect, useState } from "react";

import {
  deleteRouteFactory,
  getRouteFactories,
  IRouteFactory,
} from "../../api/routes";

import { EditRouteFactoryDrawerChild } from "./EditRouteFactoryDrawerChild";
import { RouteFactoryDrawerChild } from "./RouteFactoryDrawerChild";

function RouteFactoryDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [routeFactoryDrawerVisible, setRouteFactoryVisible] = useState(false);
  const [editRouteFactoryDrawerVisible, setEditRouteFactoryVisible] =
    useState(false);

  const [routeFactories, setRouteFactories] = useState<IRouteFactory[]>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRouteFactory, setselectedRouteFactory] =
    useState<IRouteFactory>();

  const fetchRouteFactories = async () => {
    const result = await getRouteFactories();
    setRouteFactories(result);
  };

  useEffect(() => {
    try {
      fetchRouteFactories();
    } catch (err) {
      message.error("Oops..!");
    }
  }, []);

  return (
    <Drawer
      title={
        <Space align="center">
          <>List des Itinéraires</>
          <Button
            type="dashed"
            shape="circle"
            onClick={() => setRouteFactoryVisible(true)}
          >
            <Tooltip title="Ajouter un Pack">
              <PlusOutlined style={{ fontSize: 16 }} />
            </Tooltip>
          </Button>
        </Space>
      }
      width={"40%"}
      onClose={onClose}
      visible={visible}
    >
      <List
        dataSource={routeFactories}
        renderItem={(item) => {
          return (
            <List.Item
              key={item?.objectId}
              actions={[
                <Button
                  shape="circle"
                  type="primary"
                  ghost
                  onClick={() => {
                    setselectedRouteFactory(item);
                    setTimeout(() => {
                      setEditRouteFactoryVisible(true);
                    }, 100);
                  }}
                >
                  <Tooltip title="Modifier" placement="bottom">
                    <EditOutlined />
                  </Tooltip>
                </Button>,
                <Popconfirm
                  title="Êtes-vous sûr de supprimer ce pack ?"
                  placement="leftBottom"
                  okButtonProps={{
                    loading: deleteLoading,
                  }}
                  onConfirm={async () => {
                    try {
                      setDeleteLoading(true);
                      await deleteRouteFactory(item.objectId);
                      fetchRouteFactories();
                      setDeleteLoading(false);
                    } catch (err) {
                      setDeleteLoading(false);
                      message.error("Oops..!", 3);
                    }
                  }}
                >
                  <Button shape="circle" danger>
                    <Tooltip title="Suprimer" placement="bottom">
                      <DeleteOutlined />
                    </Tooltip>
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<ContainerOutlined />} />}
                title={item?.name}
                description={`Visites: ${item?.visits?.length ?? 0}`}
              />
            </List.Item>
          );
        }}
      />
      {routeFactoryDrawerVisible && (
        <RouteFactoryDrawerChild
          visible={routeFactoryDrawerVisible}
          fetchRouteFactories={fetchRouteFactories}
          onClose={() => setRouteFactoryVisible(false)}
        />
      )}

      {editRouteFactoryDrawerVisible && (
        <EditRouteFactoryDrawerChild
          visible={editRouteFactoryDrawerVisible}
          fetchRouteFactories={fetchRouteFactories}
          onClose={() => setEditRouteFactoryVisible(false)}
          routeFactory={selectedRouteFactory}
        />
      )}
    </Drawer>
  );
}

export default RouteFactoryDrawer;
