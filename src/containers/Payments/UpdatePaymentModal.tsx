/* eslint-disable react-hooks/exhaustive-deps */
import {
  Col,
  Modal,
  Row,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Badge,
  message,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentTypes,
  IPayment,
  IPaymentType,
  updatePayment,
} from "../../api/payments";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { RootState } from "../../store";

export function UpadatePaymentModal({
  visible,
  onClose,
  payment,
  fetchPayment,
}: {
  visible: boolean;
  onClose: () => void;
  payment: IPayment;
  fetchPayment: () => void;
}) {
  const dispatch = useDispatch();
  // page State
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { clients, loading } = useSelector((state: RootState) => state.clients);
  const [paymentTypes, setPaymentTypes] = useState<IPaymentType[]>([]);

  //  Data

  //   Side Effects
  useEffect(() => {
    if (!clients) {
      dispatch(getClientsThunk({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  useEffect(() => {
    form.setFieldsValue({
      client: payment.client.objectId,
      paymentDate: moment(payment.paymentDate),
      amount: payment.amount,
      paymentType: payment.paymentType.objectId,
    });
  }, []);

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
  const handleOk = () => {
    form.submit();
  };

  const handleOnFormSubmitted = async (values) => {
    const _payment: IPayment = {
      objectId: payment.objectId,
      client: { objectId: values.client, fullName: "_" },
      paymentDate: values.paymentDate.toDate(),
      amount: values.amount,
      paymentType: {
        objectId: values.paymentType,
      },
    };
    try {
      setConfirmLoading(true);
      await updatePayment(_payment);
      fetchPayment();
      setConfirmLoading(false);
      onClose();

      message.success("Modifier avect succée ", 3);
    } catch (err) {
      message.error(err.message, 3);
    }
  };
  return (
    <Modal
      title="Ajouter un payment"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        name="form_in_modal"
        layout="vertical"
        onFinish={handleOnFormSubmitted}
        requiredMark={false}
      >
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name="client"
              label="Client"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "Le champ ne peut pas être vide" },
              ]}
            >
              <Select
                size="large"
                showSearch
                placeholder="Sélectionner un client"
                optionFilterProp="children"
                loading={loading}
                autoFocus
                filterOption={(input, option) => {
                  return (
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {clients?.map((client) => (
                  <Select.Option key={client.objectId} value={client.objectId}>
                    {client.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="paymentDate" label="Date">
              <DatePicker
                size="large"
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Badge.Ribbon text="Da" />
            <Form.Item name="amount" label="Montan">
              <InputNumber size="large" style={{ width: "100%" }} />
            </Form.Item>
            {/* </Badge.Ribbon> */}
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentType"
              label="Type de paiement"
              initialValue={1}
            >
              <Select size="large" style={{ width: "100%" }}>
                {paymentTypes.map((item) => (
                  <Select.Option key={item.objectId} value={item.objectId}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
