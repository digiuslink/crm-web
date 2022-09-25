import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message, Modal, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import {
  createConfig,
  deleteConfig,
  getConfigs,
  ISettingsParm,
  RouteModelNames,
  updateConfig,
} from "../../api/routes";
import { ConfigItem } from "../../components/ConfigItem";

export function ConfigsDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  /*
   * ========================
   * Page State
   * ========================
   */
  // routeState
  const [addRouteStateModalVisible, setAddRouteStateModalVisible] =
    useState(false);
  const [editRouteStateModalVisible, setEditRouteStateModalVisible] =
    useState(false);
  // clientState
  const [addClientStateModalVisible, setAddClientStateModalVisible] =
    useState(false);
  const [editClientStateModalVisible, setEditClientStateModalVisible] =
    useState(false);
  // visitType
  const [addVisitTypeModalVisible, setAddVisitTypeModalVisible] =
    useState(false);
  const [editVisitTypeModalVisible, setEditVisitTypeModalVisible] =
    useState(false);
  /*
   * ========================
   * Data State
   * ========================
   */

  // !routeState
  const [routeStates, setRouteStates] = useState<ISettingsParm[]>();
  const [fetchLoading, setFetchLoading] = useState(false);
  //  Add
  const [routeStateText, setRouteStateText] = useState<string | undefined>(
    undefined
  );
  const [addRouteStateLoading, setAddRouteStateLoading] = useState(false);
  // update
  const [editConfigLoading, setEditConfigLoading] = useState(false);
  const [editRouteStateText, setEditRouteStateText] = useState<
    string | undefined
  >(undefined);
  const [selectedRouteStateId, setSelectedRouteStateId] = useState<
    string | undefined
  >(undefined);
  // Delete
  const [deleteConfigLoading, setDeleteConfigLoading] = useState(false);

  // !ClientState
  const [clientStates, setClientStates] = useState<ISettingsParm[]>();
  //  Add
  const [clientText, setClientText] = useState<string | undefined>(undefined);
  // update
  const [editClientText, setEditClientText] = useState<string | undefined>(
    undefined
  );
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    undefined
  );
  // !VisitType
  const [visitTypes, setVisitTypes] = useState<ISettingsParm[]>();
  //  Add
  const [visitTypeText, setVisitTypeText] = useState<string | undefined>(
    undefined
  );
  // update
  const [editVisitTypeText, setEditVisitTypeText] = useState<
    string | undefined
  >(undefined);
  const [selectedVisitTypeId, setSelectedVisitTypeId] = useState<
    string | undefined
  >(undefined);

  /*
   * ========================
   * Side Effects
   * ========================
   */
  const fetchConfigs = async () => {
    try {
      setFetchLoading(true);
      setRouteStates(await getConfigs(RouteModelNames.routeState));
      setClientStates(await getConfigs(RouteModelNames.clientState));
      setVisitTypes(await getConfigs(RouteModelNames.visitType));

      setFetchLoading(false);
    } catch (err) {
      message.error("Oops..!");
    }
  };
  useEffect(() => {
    fetchConfigs();
  }, []);
  /*
   * ========================
   * Handlers
   * ========================
   */
  //   ! Create
  const handleAddConfig = async (model: RouteModelNames) => {
    let _conf: ISettingsParm;
    switch (model) {
      case RouteModelNames.routeState:
        _conf = {
          name: routeStateText,
        };
        break;
      case RouteModelNames.clientState:
        _conf = {
          name: clientText,
        };
        break;
      case RouteModelNames.visitType:
        _conf = {
          name: visitTypeText,
        };
        break;
      default:
        break;
    }
    try {
      setAddRouteStateLoading(true);
      await createConfig(model, _conf);
      fetchConfigs();
      setAddRouteStateLoading(false);
      setAddRouteStateModalVisible(false);
      setAddClientStateModalVisible(false);
      setAddVisitTypeModalVisible(false);
      message.success("Ajouté avec succès");
    } catch (err) {
      setAddRouteStateLoading(false);
      message.error(err.message, 3);
      message.error("Opps..!", 3);
    }
  };
  // ! Update
  const handleUpdateConfig = async (model: RouteModelNames) => {
    let _conf: ISettingsParm;
    switch (model) {
      case RouteModelNames.routeState:
        _conf = {
          name: editRouteStateText,
          objectId: selectedRouteStateId,
        };
        break;
      case RouteModelNames.clientState:
        _conf = {
          name: editClientText,
          objectId: selectedClientId,
        };
        break;
      case RouteModelNames.visitType:
        _conf = {
          name: editVisitTypeText,
          objectId: selectedVisitTypeId,
        };
        break;

      default:
        break;
    }

    try {
      setEditConfigLoading(true);
      await updateConfig(model, _conf);
      fetchConfigs();

      setEditConfigLoading(false);
      setEditRouteStateModalVisible(false);
      setEditClientStateModalVisible(false);
      setEditVisitTypeModalVisible(false);

      message.success("Modifié avec succès");
    } catch (err) {
      setEditConfigLoading(false);
      message.error("Oops..!", 3);
    }
  };
  // ! Delete
  const handleDeleteConfig = async (
    model: RouteModelNames,
    configId: string
  ) => {
    try {
      setDeleteConfigLoading(true);
      await deleteConfig(model, configId);
      fetchConfigs();
      message.info("Supprimé avec succès");
      setDeleteConfigLoading(false);
    } catch (err) {
      setDeleteConfigLoading(false);

      message.error(err.message, 3);
    }
  };

  /*
   * ========================
   * Rendere
   * ========================
   */
  return (
    <Drawer visible={visible} onClose={onClose} title="Configs" width="30%">
      {fetchLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Typography.Text strong>Etats itinéraire</Typography.Text>
          {routeStates?.map((item) => (
            <ConfigItem
              key={item.objectId}
              configItem={item}
              onEdit={(item) => {
                setEditRouteStateText(item.name);
                setSelectedRouteStateId(item.objectId);
                setEditRouteStateModalVisible(true);
              }}
              onDelete={(item) => {
                handleDeleteConfig(RouteModelNames.routeState, item.objectId);
              }}
              deleteLoading={deleteConfigLoading}
            />
          ))}
          <Button
            type="dashed"
            onClick={() => {
              setAddRouteStateModalVisible(true);
            }}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: 12 }}
          >
            Ajouter un état
          </Button>

          <div style={{ height: 12 }} />
          <Typography.Text strong>Types de visites</Typography.Text>
          {visitTypes?.map((item) => (
            <ConfigItem
              key={item.objectId}
              configItem={item}
              onEdit={(item) => {
                setEditVisitTypeText(item.name);
                setSelectedVisitTypeId(item.objectId);
                setEditVisitTypeModalVisible(true);
              }}
              onDelete={(item) => {
                handleDeleteConfig(RouteModelNames.visitType, item.objectId);
              }}
              deleteLoading={deleteConfigLoading}
            />
          ))}
          <Button
            type="dashed"
            onClick={() => {
              setAddVisitTypeModalVisible(true);
            }}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: 12 }}
          >
            Ajouter un type de visite
          </Button>
          <div style={{ height: 12 }} />
          <Typography.Text strong>Etats client</Typography.Text>
          {clientStates?.map((item) => (
            <ConfigItem
              key={item.objectId}
              configItem={item}
              onEdit={(item) => {
                setEditClientText(item.name);
                setSelectedClientId(item.objectId);
                setEditClientStateModalVisible(true);
              }}
              onDelete={(item) => {
                handleDeleteConfig(RouteModelNames.clientState, item.objectId);
              }}
              deleteLoading={deleteConfigLoading}
            />
          ))}
          <Button
            type="dashed"
            onClick={() => {
              setAddClientStateModalVisible(true);
            }}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: 12 }}
          >
            Ajouter un état Client
          </Button>
        </>
      )}
      {/*
       * ========================
       * Modals
       * ========================
       */}
      {addRouteStateModalVisible && (
        <Modal
          visible={addRouteStateModalVisible}
          title="Ajouter un état"
          onCancel={() => setAddRouteStateModalVisible(false)}
          onOk={() => handleAddConfig(RouteModelNames.routeState)}
          okButtonProps={{
            loading: addRouteStateLoading,
            disabled:
              routeStateText === undefined || routeStateText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            onChange={(e) => {
              setRouteStateText(e.target.value);
            }}
          />
        </Modal>
      )}
      {editRouteStateModalVisible && (
        <Modal
          visible={editRouteStateModalVisible}
          title="Ajouter un état"
          onCancel={() => setEditRouteStateModalVisible(false)}
          onOk={() => handleUpdateConfig(RouteModelNames.routeState)}
          okButtonProps={{
            loading: editConfigLoading,
            disabled:
              editRouteStateText === undefined ||
              editRouteStateText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            value={editRouteStateText}
            onChange={(e) => {
              setEditRouteStateText(e.target.value);
            }}
          />
        </Modal>
      )}
      {addClientStateModalVisible && (
        <Modal
          visible={addClientStateModalVisible}
          title="Ajouter un état Client"
          onCancel={() => setAddClientStateModalVisible(false)}
          onOk={() => handleAddConfig(RouteModelNames.clientState)}
          okButtonProps={{
            loading: editConfigLoading,
            disabled: clientText === undefined || clientText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            onChange={(e) => {
              setClientText(e.target.value);
            }}
          />
        </Modal>
      )}
      {editClientStateModalVisible && (
        <Modal
          visible={editClientStateModalVisible}
          title="Modifié un état Client"
          onCancel={() => setEditClientStateModalVisible(false)}
          onOk={() => handleUpdateConfig(RouteModelNames.clientState)}
          okButtonProps={{
            loading: editConfigLoading,
            disabled:
              editClientText === undefined || editClientText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            value={editClientText}
            onChange={(e) => {
              setEditClientText(e.target.value);
            }}
          />
        </Modal>
      )}
      {addVisitTypeModalVisible && (
        <Modal
          visible={addVisitTypeModalVisible}
          title="Ajouter un type de visite"
          onCancel={() => setAddVisitTypeModalVisible(false)}
          onOk={() => handleAddConfig(RouteModelNames.visitType)}
          okButtonProps={{
            loading: editConfigLoading,
            disabled:
              visitTypeText === undefined || visitTypeText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            onChange={(e) => {
              setVisitTypeText(e.target.value);
            }}
          />
        </Modal>
      )}
      {editVisitTypeModalVisible && (
        <Modal
          visible={editVisitTypeModalVisible}
          title="Modifier un type de visite"
          onCancel={() => setEditVisitTypeModalVisible(false)}
          onOk={() => handleUpdateConfig(RouteModelNames.visitType)}
          okButtonProps={{
            loading: editConfigLoading,
            disabled:
              editVisitTypeText === undefined ||
              editVisitTypeText?.length === 0,
          }}
        >
          <Typography.Text>Etat </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Etat"
            value={editVisitTypeText}
            onChange={(e) => {
              setEditVisitTypeText(e.target.value);
            }}
          />
        </Modal>
      )}
    </Drawer>
  );
}
