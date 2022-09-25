/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import { IPaymentType } from "../../api/payments";
import {
  addSettingsParam,
  deleteSettingParam,
  getSettingsParams,
  updateSettingParam,
} from "../../api/rma";
import { ISettingsParm } from "../../api/routes";
import { ConfigItem } from "../../components/ConfigItem";
import { IDrawerProps } from "../IDrawer";

/* //!========================= DUMMY DATA =========================!// */

/* //!========================= Component ========================= !// */
export function RMASettingsDrawer({ onClose, visible }: IDrawerProps) {
  //   ! Page State
  const [addPaymentTypeModalVisible, setAddPaymentTypeModalVisible] =
    useState(false);
  const [editPaymentTypeModalVisible, setEditPaymentTypeModalVisible] =
    useState(false);
  const [addRmaReasonModalVisible, setAddRmaReasonModalVisible] =
    useState(false);
  const [editRmaReasonModalVisible, setEditRmaReasonModalVisible] =
    useState(false);
  // ! Data State

  const [rmaReasons, setRMAReasons] = useState<ISettingsParm[]>([]);
  const [vias, setVias] = useState<ISettingsParm[]>([]);

  const [pTypeText, setPTypeText] = useState<string>();
  const [pEditedTypeText, setPEditedTypeText] = useState<string>();
  const [pEditedTypeID, setPEditedTypeID] = useState<string>();

  const [addPTypeLoading, setAddPTypeLoading] = useState(false);
  const [editPTypeLoading, setEditPTypeLoading] = useState(false);
  const [deletePTypeLoading, setDeletePTypeLoading] = useState(false);

  // Side Effects
  const fetchPaymentTypes = async () => {
    try {
      const _rmaReasons = await getSettingsParams("rmaReason");
      const _vias = await getSettingsParams("via");

      setRMAReasons(_rmaReasons);
      setVias(_vias);
    } catch (err) {
      message.error("Oops..!");
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  // Handlers
  const handleAddParam = async (param: string) => {
    try {
      setAddPTypeLoading(true);
      await addSettingsParam(param, { name: pTypeText });
      fetchPaymentTypes();
      setAddPTypeLoading(false);
      message.success("Ajouté avec succès", 2);
      setAddPaymentTypeModalVisible(false);
      setAddRmaReasonModalVisible(false);
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };

  const handleEditParam = async (param: string) => {
    try {
      setEditPTypeLoading(true);
      await updateSettingParam(param, {
        objectId: pEditedTypeID,
        name: pEditedTypeText,
      });
      await fetchPaymentTypes();
      setEditPTypeLoading(false);
      message.success("Modifié avec succès", 2);
      setEditPaymentTypeModalVisible(false);
      setEditRmaReasonModalVisible(false);
    } catch (err) {
      setEditPTypeLoading(false);
      message.error("Oops..!", 3);
    }
  };

  const handleDeleteParam = async (param: string, item: IPaymentType) => {
    try {
      setDeletePTypeLoading(true);
      await deleteSettingParam(param, item.objectId);
      await fetchPaymentTypes();
      setDeletePTypeLoading(false);
      message.success("supprimé avec succès", 2);
    } catch (err) {
      setDeletePTypeLoading(false);
      message.error(err.message, 3);
    }
  };

  /* ========================= Render ========================= */
  return (
    <>
      <Drawer
        title="Paramètres RMA"
        width="30%"
        onClose={onClose}
        visible={visible}
        // bodyStyle={{ paddingBottom: 80 }}
      >
        <Typography.Text strong>Motifs de retour</Typography.Text>

        {rmaReasons.map((pType) => (
          <ConfigItem
            key={pType.objectId}
            configItem={pType}
            onEdit={(item) => {
              setPEditedTypeText(item.name);
              setPEditedTypeID(item.objectId);
              setEditRmaReasonModalVisible(true);
            }}
            onDelete={(objectId) => handleDeleteParam("rmaReason", objectId)}
            deleteLoading={deletePTypeLoading}
          />
        ))}
        <Button
          type="dashed"
          onClick={() => {
            setAddRmaReasonModalVisible(true);
          }}
          icon={<PlusOutlined />}
          style={{ width: "100%", marginTop: 12, marginBottom: 24 }}
        >
          Ajouter un motif de retour
        </Button>

        <Typography.Text strong>VIA Commercial</Typography.Text>

        {vias.map((pType) => (
          <ConfigItem
            key={pType.objectId}
            configItem={pType}
            onEdit={(item) => {
              setPEditedTypeText(item.name);
              setPEditedTypeID(item.objectId);
              setEditPaymentTypeModalVisible(true);
            }}
            onDelete={(objectId) => handleDeleteParam("via", objectId)}
            deleteLoading={deletePTypeLoading}
          />
        ))}
        <Button
          type="dashed"
          onClick={() => {
            setAddPaymentTypeModalVisible(true);
          }}
          icon={<PlusOutlined />}
          style={{ width: "100%", marginTop: 12 }}
        >
          Ajouter un VIA Commercial
        </Button>
      </Drawer>
      {addPaymentTypeModalVisible && (
        <Modal
          title=" Ajouter un VIA Commercialr"
          visible={addPaymentTypeModalVisible}
          onCancel={() => setAddPaymentTypeModalVisible(false)}
          onOk={() => handleAddParam("via")}
          okButtonProps={{
            disabled: pTypeText?.length === 0 || !pTypeText,
            loading: addPTypeLoading,
          }}
        >
          <Typography.Text>VIA Commercial</Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Type"
            onChange={(e) => setPTypeText(e.target.value)}
          />
        </Modal>
      )}
      {addRmaReasonModalVisible && (
        <Modal
          title=" Ajouter un Motif de retour"
          visible={addRmaReasonModalVisible}
          onCancel={() => setAddRmaReasonModalVisible(false)}
          onOk={() => handleAddParam("rmaReason")}
          okButtonProps={{
            disabled: pTypeText?.length === 0 || !pTypeText,
            loading: addPTypeLoading,
          }}
        >
          <Typography.Text>Motif de retour</Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Type"
            onChange={(e) => setPTypeText(e.target.value)}
          />
        </Modal>
      )}

      {editPaymentTypeModalVisible && (
        <Modal
          title="Modifier un VIA Commercial"
          visible={editPaymentTypeModalVisible}
          onCancel={() => setEditPaymentTypeModalVisible(false)}
          onOk={() => handleEditParam("via")}
          okButtonProps={{
            disabled: pEditedTypeText?.length === 0 || !pEditedTypeText,
            loading: editPTypeLoading,
          }}
        >
          <Typography.Text> VIA Commercial </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Type"
            value={pEditedTypeText}
            onChange={(e) => setPEditedTypeText(e.target.value)}
          />
        </Modal>
      )}
      {editRmaReasonModalVisible && (
        <Modal
          title="Modifier un VIA Commercial"
          visible={editRmaReasonModalVisible}
          onCancel={() => setEditRmaReasonModalVisible(false)}
          onOk={() => handleEditParam("rmaReason")}
          okButtonProps={{
            disabled: pEditedTypeText?.length === 0 || !pEditedTypeText,
            loading: editPTypeLoading,
          }}
        >
          <Typography.Text> Motif de retour </Typography.Text>
          <br />
          <Input
            style={{ width: "40%" }}
            placeholder="Type"
            value={pEditedTypeText}
            onChange={(e) => setPEditedTypeText(e.target.value)}
          />
        </Modal>
      )}
    </>
  );
}
