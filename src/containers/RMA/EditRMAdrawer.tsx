import {
  ArrowDownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Select,
  DatePicker,
  Divider,
  Typography,
  InputNumber,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { RootState } from "../../store";
import { getProductsThunk } from "../../core/configSlice";
import { ISettingsParm } from "../../api/routes";
import { addRMA, editRMA, getSettingsParams } from "../../api/rma";
import { IRMA } from "../../pages/RMA/RMAs";

const { Option } = Select;

export function EditRMADrawer({
  visible,
  onClose,
  fetch,
  rma,
}: {
  visible: boolean;
  onClose: () => void;
  fetch?: () => void;
  rma?: IRMA;
}) {
  const dispatch = useDispatch();
  const { clients } = useSelector((state: RootState) => state.clients);
  const { productsResponseState, products } = useSelector(
    (state: RootState) => state.configs
  );
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [rmaVias, setRmaVias] = useState<ISettingsParm[]>();
  const [rmaReasons, setRmaReasons] = useState<ISettingsParm[]>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!clients) {
      dispatch(getClientsThunk({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  const fetchRMASettigns = async () => {
    try {
      setSettingsLoading(true);
      setRmaVias(await getSettingsParams("via"));
      setRmaReasons(await getSettingsParams("rmaReason"));
      setSettingsLoading(false);
    } catch (err) {
      setSettingsLoading(false);
      message.error("Opps..!", 3);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      blfDate: moment(rma?.rmaDate),
      client: rma?.client?.objectId,
      via: rma?.via?.objectId,
      blfItems: rma.products.map((pr) => {
        const _pr = {
          designation: pr.designation,
          qte: pr.qte,
          rmaReason: pr.rmaReason.objectId,
        };
        return _pr;
      }),
    });
    if (!products) {
      dispatch(getProductsThunk());
    }
    fetchRMASettigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const [addRMALoading, setAddRMALoading] = useState(false);

  const handleOnFormSubmitted = async (values: any) => {
    const _rma: IRMA = {
      objectId: rma?.objectId,
      client: { objectId: values.client },
      via: { objectId: values.via },
      rmaDate: values.blfDate?.toDate(),
      products: values.blfItems?.map((pr: any) => {
        return {
          designation: pr.designation,
          rmaReason: { objectId: pr.rmaReason },
          qte: pr.qte,
        };
      }),
    };
    try {
      setAddRMALoading(true);
      await editRMA(_rma);
      fetch();
      setAddRMALoading(false);
      onClose();
      message.success("Ajouté avec succès", 3);
    } catch (err) {
      setAddRMALoading(false);
      console.log(err);
      message.error("Opps..!", 3);
    }
  };

  return (
    <Drawer
      title="Ajouter un RMA"
      width={"60%"}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ float: "right" }}>
          <Button
            onClick={() => {
              onClose();
              form.resetFields();
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={addRMALoading}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        name="add-client"
        layout="vertical"
        hideRequiredMark
        onFinish={handleOnFormSubmitted}
        size="large"
      >
        <Row gutter={8}>
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
                showSearch
                placeholder="Sélectionner un client"
                optionFilterProp="children"
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
                  <Option key={client.objectId} value={client.objectId}>
                    {client.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="blfDate" label="Date">
              <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="via" label="Via Commercial">
              <Select>
                {rmaVias?.map((via) => {
                  return (
                    <Select.Option key={via.objectId} value={via.objectId}>
                      {via.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Form.List name="blfItems">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Form.Item
                    label={
                      index === 0 && (
                        <Typography.Title level={5}>Articles</Typography.Title>
                      )
                    }
                    key={field.key}
                    style={{ margin: 0 }}
                  >
                    {index === 0 && (
                      <Row gutter={4}>
                        <Col span={8}>
                          <Typography.Text type="secondary" strong>
                            Produit
                          </Typography.Text>
                        </Col>
                        <Col span={7}>
                          <Typography.Text type="secondary" strong>
                            Motif
                          </Typography.Text>
                        </Col>
                        <Col span={7}>
                          <Typography.Text type="secondary" strong>
                            Quantité
                          </Typography.Text>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={4}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "designation"]}
                          style={{ marginBottom: 4 }}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message: "Le champ ne peut pas être vide",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Produit"
                            optionFilterProp="children"
                            loading={productsResponseState === "loading"}
                            filterOption={(input, option) => {
                              return (
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {products?.map((pr) => (
                              <Option key={pr} value={pr}>
                                {pr}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          name={[field.name, "rmaReason"]}
                          style={{ marginBottom: 4 }}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message: "Le champ ne peut pas être vide",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Motif"
                            loading={settingsLoading}
                            allowClear
                          >
                            {rmaReasons?.map((pr) => (
                              <Option key={pr.objectId} value={pr.objectId}>
                                {pr.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          style={{ marginBottom: 4 }}
                          validateTrigger={["onChange", "onBlur"]}
                          name={[field.name, "qte"]}
                          rules={[
                            {
                              required: true,
                              message: "Le champ ne peut pas être vide",
                            },
                          ]}
                          // noStyle
                        >
                          <InputNumber
                            placeholder="Quantité"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        {fields.length > 0 ? (
                          <MinusCircleOutlined
                            style={{
                              padding: 4,
                              fontSize: 20,
                              color: "tomato",
                              marginLeft: 2,
                            }}
                            onClick={async () => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: 12 }}
                >
                  Ajouter un article
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}
