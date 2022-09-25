/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  addPaymentType,
  deletePaymentType,
  getPaymentTypes,
  IPaymentType,
  updatePaymentType,
} from "../../api/payments";
import { ConfigItem } from "../../components/ConfigItem";
import { IDrawerProps } from "../IDrawer";

/* ========================= Render ========================= */

export function PaimentSettingsDrawer({ onClose, visible }: IDrawerProps) {
  const [paymentTypes, setPaymentTypes] = useState<IPaymentType[]>([]);
  const [addPaymentTypeModalVisible, setAddPaymentTypeModalVisible] =
    useState(false);
  const [editPaymentTypeModalVisible, setEditPaymentTypeModalVisible] =
    useState(false);
  const [pTypeText, setPTypeText] = useState<string>();
  const [pEditedTypeText, setPEditedTypeText] = useState<string>();
  const [pEditedTypeID, setPEditedTypeID] = useState<string>();

  const [addPTypeLoading, setAddPTypeLoading] = useState(false);
  const [editPTypeLoading, setEditPTypeLoading] = useState(false);
  const [deletePTypeLoading, setDeletePTypeLoading] = useState(false);

  // Side Effects
  const fetchPaymentTypes = async () => {
    try {
      const _paymentTYpes = await getPaymentTypes();
      setPaymentTypes(_paymentTYpes);
    } catch (err) {
      message.error("Oops..!");
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  // Handlers
  const handleAddPaymentType = async () => {
    try {
      setAddPTypeLoading(true);
      await addPaymentType({ name: pTypeText });
      fetchPaymentTypes();
      setAddPTypeLoading(false);
      message.success("Ajouté avec succès", 2);
      setAddPaymentTypeModalVisible(false);
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };

  const handleEditPaymentType = async () => {
    try {
      setEditPTypeLoading(true);
      await updatePaymentType({
        objectId: pEditedTypeID,
        name: pEditedTypeText,
      });
      await fetchPaymentTypes();
      setEditPTypeLoading(false);
      message.success("Modifié avec succès", 2);
      setEditPaymentTypeModalVisible(false);
    } catch (err) {
      setEditPTypeLoading(false);
      message.error("Oops..!", 3);
    }
  };

  const handleDeletePaymentType = async (item: IPaymentType) => {
    try {
      setDeletePTypeLoading(true);
      await deletePaymentType(item.objectId);
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
        title="Paramètres payment"
        width="30%"
        onClose={onClose}
        visible={visible}
        // bodyStyle={{ paddingBottom: 80 }}
      >
        <Typography.Text strong>Types de payments</Typography.Text>

        {paymentTypes.map((pType) => (
          <ConfigItem
            key={pType.objectId}
            configItem={pType}
            onEdit={(item) => {
              setPEditedTypeText(item.name);
              setPEditedTypeID(item.objectId);
              setEditPaymentTypeModalVisible(true);
            }}
            onDelete={handleDeletePaymentType}
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
          Ajouter un type de paiement
        </Button>
      </Drawer>
      {addPaymentTypeModalVisible && (
        <Modal
          title="Ajouter un type de paiement"
          visible={addPaymentTypeModalVisible}
          onCancel={() => setAddPaymentTypeModalVisible(false)}
          onOk={handleAddPaymentType}
          okButtonProps={{
            disabled: pTypeText?.length === 0 || !pTypeText,
            loading: addPTypeLoading,
          }}
        >
          <Typography.Text>Type de paiement </Typography.Text>
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
          title="Modifier un type de paiement"
          visible={editPaymentTypeModalVisible}
          onCancel={() => setEditPaymentTypeModalVisible(false)}
          onOk={handleEditPaymentType}
          okButtonProps={{
            disabled: pEditedTypeText?.length === 0 || !pEditedTypeText,
            loading: editPTypeLoading,
          }}
        >
          <Typography.Text>Type de paiement </Typography.Text>
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
