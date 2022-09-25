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
  addPayment,
  getPaymentTypes,
  IPayment,
  IPaymentType,
} from "../../api/payments";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { getPaymentsThunk } from "../../pages/Payments/paymentSlice";
import { RootState } from "../../store";

export function AddPaymentModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
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

  useEffect(() => {
    if (paymentTypes) {
      form.setFieldsValue({ paymentType: paymentTypes[0]?.objectId });
    }
  }, [paymentTypes]);

  // Handlers
  const handleOk = () => {
    form.submit();
  };

  const handleOnFormSubmitted = async (values) => {
    const _payment: IPayment = {
      client: { objectId: values.client, fullName: "_" },
      paymentDate: values.paymentDate.toDate(),
      amount: values.amount,
      paymentType: { objectId: values.paymentType },
    };

    try {
      setConfirmLoading(true);
      await addPayment(_payment);
      dispatch(getPaymentsThunk({}));
      setConfirmLoading(false);
      onClose();
      message.success("Ajouter avect succée ", 3);
    } catch (err) {
      setConfirmLoading(false);
      message.error("Oppss..!", 3);
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
                autoFocus
                loading={loading}
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
            <Form.Item
              name="paymentDate"
              label="Date"
              initialValue={moment(new Date())}
            >
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
            <Form.Item name="paymentType" label="Type de paiement">
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
