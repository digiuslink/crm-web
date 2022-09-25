import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IPack, updatePack } from "../../api/pack";
import { getProductsThunk } from "../../core/configSlice";
import { getPacksThunk } from "../../pages/BLFs/packSlice";
import { RootState } from "../../store";

const { Option } = Select;

function EditPackDrawerChild({
  visible,
  onClose,
  pack,
}: {
  visible: boolean;
  onClose: () => void;
  pack: IPack;
}) {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [updatePackLoading, setUpdatePackLoading] = useState(false);

  const { productsResponseState, products } = useSelector(
    (state: RootState) => state.configs
  );

  useEffect(() => {
    if (!products) {
      dispatch(getProductsThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...pack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Handlers
  const handleUpdatePack = async (values: IPack) => {
    try {
      values.objectId = pack.objectId;
      setUpdatePackLoading(true);
      await updatePack(values);
      dispatch(getPacksThunk());
      setUpdatePackLoading(false);
      message.success("Le Pack est modifié");
      onClose();
    } catch (err) {
      message.error("Oopps..!");
    }
  };

  return (
    <Drawer
      title="Modifier un Pack"
      width={"45%"}
      onClose={onClose}
      visible={visible}
      footer={[
        <Button
          onClick={() => {
            onClose();
            form.resetFields();
          }}
          style={{ marginRight: 8, float: "right" }}
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          htmlType="submit"
          loading={updatePackLoading}
          style={{ marginRight: 8, float: "right" }}
          onClick={() => {
            form.submit();
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="add-client"
        layout="vertical"
        hideRequiredMark
        onFinish={handleUpdatePack}
        size="middle"
      >
        <Col span={18}>
          <Form.Item
            name="packName"
            label="Nom du pack"
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              { required: true, message: "Le champ ne peut pas être vide" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
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

export default EditPackDrawerChild;
