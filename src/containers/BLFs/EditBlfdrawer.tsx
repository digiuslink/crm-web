import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
  Badge,
  InputNumber,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { RootState } from "../../store";
import { IBlf, IBlfItem, updateBlfThunk } from "../../pages/BLFs/blfSlice";
import { getProductsThunk } from "../../core/configSlice";

const { Option } = Select;

export function EditBlfdrawer({
  visible,
  onClose,
  blf,
}: {
  visible: boolean;
  onClose: () => void;
  blf: IBlf;
}) {
  const dispatch = useDispatch();
  const { clients } = useSelector((state: RootState) => state.clients);
  const { productsResponseState, products } = useSelector(
    (state: RootState) => state.configs
  );
  const { updateBlfLoading } = useSelector((state: RootState) => state.blf);

  const [form] = Form.useForm();

  const [remise, setRemise] = useState<number>(0);
  const [net, setNet] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (updateBlfLoading === "loaded") {
      onClose();
      message.success("Modifié avec succée", 3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBlfLoading]);
  useEffect(() => {
    if (!clients) {
      dispatch(getClientsThunk({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  useEffect(() => {
    setNet(() => {
      return blf?.total / (1 - blf.remise / 100);
    });
    setRemise(blf.remise);
    form.setFieldsValue({
      client: blf.client.objectId,
      blfDate: moment(new Date(blf.blfDate.iso), "DD,MM,YY"),
      blfItems: blf.blfItems,
    });

    if (!products) {
      dispatch(getProductsThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTotal(() => {
      let tmp = net * (1 - remise / 100);
      tmp = Number.parseFloat(tmp?.toFixed(2));
      return tmp;
      // return net * (1 - remise / 100);
    });
  }, [net, remise]);

  useEffect(() => {
    if (updateBlfLoading === "error") {
      message.error({
        content: "Oops..!",
        duration: 3,
        style: { backgroundColor: "red" },
      });
    }
  }, [updateBlfLoading]);

  // Handlers
  const handleOnFormSubmitted = async (values: any) => {
    const _blf: IBlf = {
      objectId: blf.objectId,
      client: { objectId: values.client },
      blfDate: values.blfDate?.toDate(),
      blfItems: values.blfItems,
      total: total,
      remise: remise,
    };

    dispatch(updateBlfThunk(_blf));
  };

  const handleCalculateTotal = () => {
    const blfItems: IBlfItem[] = form.getFieldsValue().blfItems;
    setNet(() => {
      let sum: number = 0;
      blfItems?.forEach((item) => {
        if (item?.price && item?.qte) sum = sum + item?.price * item?.qte;
        if (item?.remise) sum = sum * (1 - item.remise / 100);
      });
      return sum;
    });
  };
  return (
    <Drawer
      title="Modifier un BL/F"
      width={"60%"}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flexGrow: 1 }}>
            <Row gutter={3}>
              <Col span={8}>
                <Typography.Title type="secondary" level={4}>
                  Net
                </Typography.Title>
              </Col>
              <Col span={8}>
                <Typography.Title type="secondary" level={4}>
                  <Badge.Ribbon
                    text="Da"
                    style={{ position: "absolute", top: 0 }}
                  >
                    {net}
                  </Badge.Ribbon>
                </Typography.Title>
              </Col>
            </Row>

            <Row gutter={3} style={{ alignItems: "center" }}>
              <Col span={8}>
                <Typography.Title type="danger" level={5}>
                  Remise
                </Typography.Title>
              </Col>
              <Col span={8}>
                <Typography.Title type="danger" level={5}>
                  <Badge.Ribbon
                    text="%"
                    color="red"
                    style={{ position: "absolute", top: 0 }}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      value={remise}
                      onChange={(v) => setRemise(v)}
                    />
                  </Badge.Ribbon>
                </Typography.Title>
              </Col>
            </Row>
            <Row gutter={3}>
              <Col span={8}>
                <Typography.Title level={3}>Total</Typography.Title>
              </Col>
              <Col span={8}>
                <Typography.Title level={3}>
                  <Badge.Ribbon
                    color="green"
                    text="Da"
                    style={{ position: "absolute", top: 0 }}
                  >
                    {total}
                  </Badge.Ribbon>
                </Typography.Title>
              </Col>
            </Row>
          </div>
          <div style={{ alignSelf: "end" }}>
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
              loading={updateBlfLoading === "loading"}
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>
          </div>
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
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            Prix
                          </Typography.Text>
                        </Col>
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            Quantité
                          </Typography.Text>
                        </Col>
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            Remise
                          </Typography.Text>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={4} onBlur={handleCalculateTotal}>
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
                            placeholder="Sélectionner un Produit"
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
                      <Col span={5}>
                        <Form.Item
                          {...field}
                          style={{ marginBottom: 4 }}
                          name={[field.name, "price"]}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message: "Le champ ne peut pas être vide",
                            },
                            {
                              type: "integer",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="Prix"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
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
                      <Col span={5}>
                        <Form.Item
                          {...field}
                          style={{ marginBottom: 4 }}
                          name={[field.name, "remise"]}
                          validateTrigger={["onChange", "onBlur"]}
                        >
                          <InputNumber placeholder="Remise" min={0} max={100} />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
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
                              handleCalculateTotal();
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
