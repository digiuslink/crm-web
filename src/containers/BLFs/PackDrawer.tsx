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
import { useDispatch, useSelector } from "react-redux";
import { deletePack, IPack } from "../../api/pack";
import { getPacksThunk } from "../../pages/BLFs/packSlice";
import { RootState } from "../../store";
import PackDrawerChild from "./AddPackDrawerChild";
import EditPackDrawerChild from "./EditPackDrawerChild";

function PackDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const [packDrawerVisible, setPackDrawerVisible] = useState(false);
  const [editPackDrawerVisible, setEditPackDrawerVisible] = useState(false);
  const [packToEdit, setPackToEdit] = useState<IPack>();

  const [deletePackLoading, setDeletePackLoading] = useState(false);

  const { packs, getPacksLoading } = useSelector(
    (state: RootState) => state.pack
  );

  useEffect(() => {
    if (!packs) {
      dispatch(getPacksThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handlePackDelete = async (packObjectId: string) => {
    try {
      setDeletePackLoading(true);
      await deletePack(packObjectId);
      dispatch(getPacksThunk());
      setDeletePackLoading(false);
      message.success("Pack supprimé avec succès");
    } catch (err) {
      message.error("Oopps..!");
    }
  };
  return (
    <Drawer
      title={
        <Space align="center">
          <>List des Packs</>
          <Button
            type="dashed"
            shape="circle"
            onClick={() => setPackDrawerVisible(true)}
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
        loading={getPacksLoading === "loading"}
        dataSource={packs}
        renderItem={(item) => {
          return (
            <List.Item
              key={item.objectId}
              actions={[
                <Button
                  shape="circle"
                  type="primary"
                  ghost
                  onClick={() => {
                    setPackToEdit(item);
                    setTimeout(() => {
                      setEditPackDrawerVisible(true);
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
                  okButtonProps={{ loading: deletePackLoading }}
                  onConfirm={() => {
                    handlePackDelete(item.objectId);
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
                title={item.packName}
                description={`Article: ${item.blfItems.length}`}
              />
            </List.Item>
          );
        }}
      />
      {packDrawerVisible && (
        <PackDrawerChild
          visible={packDrawerVisible}
          onClose={() => setPackDrawerVisible(false)}
        />
      )}
      {editPackDrawerVisible && (
        <EditPackDrawerChild
          visible={editPackDrawerVisible}
          onClose={() => setEditPackDrawerVisible(false)}
          pack={packToEdit}
        />
      )}
    </Drawer>
  );
}

export default PackDrawer;
