/* eslint-disable react-hooks/exhaustive-deps */
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConfigs,
  ISettingsParm,
  IRouteFactory,
  RouteModelNames,
  updateRouteFactory,
} from "../../api/routes";
import { CITIES_LIST } from "../../assets/data/cities";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { IClient } from "../../pages/Clients/IClient";
import { RootState } from "../../store";

export function EditRouteFactoryDrawerChild({
  visible,
  onClose,
  fetchRouteFactories,
  routeFactory,
}: {
  visible: boolean;
  onClose: () => void;
  fetchRouteFactories: () => Promise<void>;
  routeFactory: IRouteFactory;
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { clients } = useSelector((state: RootState) => state.clients);
  const [visitTypes, setVisitTypes] = useState<ISettingsParm[]>();
  const [locality, setLocality] = useState<string[]>();
  const [clientsByLocality, setClientsByLocality] = useState<Array<IClient>>();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Handlers
  const handleFormSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      await updateRouteFactory({
        objectId: routeFactory.objectId,
        name: values.name,
        locality: values.locality,
        visits: values.visits,
      });
      await fetchRouteFactories();
      setSubmitLoading(false);

      message.success("modifié avec succès", 3);
      onClose();
    } catch (err) {
      setSubmitLoading(false);
      message.error("Oops..!", 3);
    }
  };

  //   Effects
  useEffect(() => {
    (async function () {
      setVisitTypes(await getConfigs(RouteModelNames.visitType));
    })();
    if (!clients) {
      dispatch(getClientsThunk({}));
    }
  }, []);

  useEffect(() => {
    const filtredClients: IClient[] = clients?.filter((client) => {
      return locality?.includes(client.wilaya);
    });
    setClientsByLocality(filtredClients);
  }, [locality]);

  useEffect(() => {
    setLocality(routeFactory.locality);
    form.setFieldsValue({
      name: routeFactory.name,
      locality: routeFactory.locality,
      visits: routeFactory.visits,
    });
  }, []);
  return (
    <Drawer
      title="Ajouter un itinéraire"
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
          loading={submitLoading}
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
        onFinish={handleFormSubmit}
        size="middle"
      >
        <Col span={18}>
          <Form.Item
            name="name"
            label="Nom d'itinéraire"
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              { required: true, message: "Le champ ne peut pas être vide!" },
            ]}
          >
            <Input autoFocus={true} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="locality"
            label="Localités"
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              { required: true, message: "Le champ ne peut pas être vide!" },
            ]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Sélectionner les Localités"
              optionFilterProp="children"
              onChange={(object) => setLocality(object as any)}
              allowClear
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
            >
              {CITIES_LIST?.map((city) => (
                <Select.Option key={city.value} value={city.value}>
                  {city.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Divider style={{ margin: 0 }} />
        <Form.List name="visits">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <>
                  <Form.Item
                    label={
                      index === 0 && (
                        <Typography.Title level={5}>
                          Les visites
                        </Typography.Title>
                      )
                    }
                    key={field.key}
                    style={{ margin: 0 }}
                  >
                    {index === 0 && (
                      <Row gutter={4}>
                        <Col span={24 / 3}>
                          <Typography.Text type="secondary" strong>
                            Client
                          </Typography.Text>
                        </Col>
                        <Col span={24 / 3}>
                          <Typography.Text type="secondary" strong>
                            Type
                          </Typography.Text>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={6}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "client"]}
                          style={{ marginBottom: 4 }}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message: "Champ requis",
                            },
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
                            {clientsByLocality?.map((client) => (
                              <Select.Option
                                key={client.objectId}
                                value={client.objectId}
                              >
                                {client.fullName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "type"]}
                          style={{ marginBottom: 4 }}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              message: "Champ requis",
                            },
                          ]}
                          initialValue={visitTypes && visitTypes[0]?.objectId}
                        >
                          <Select placeholder="type de visite">
                            {visitTypes?.map((client) => (
                              <Select.Option
                                key={client.objectId}
                                value={client.objectId}
                              >
                                {client.name}
                              </Select.Option>
                            ))}
                          </Select>
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
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: 12 }}
                >
                  Ajouter une visite
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}
