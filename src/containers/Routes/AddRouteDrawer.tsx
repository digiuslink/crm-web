/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowDownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Form,
  message,
  Row,
  Select,
  Space,
  Typography,
  Menu,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRoute,
  getConfigs,
  getRouteFactories,
  IRoute,
  ISettingsParm,
  IRouteFactory,
  IVisit,
  RouteModelNames,
} from "../../api/routes";
import { CITIES_LIST } from "../../assets/data/cities";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { getUsersThunk } from "../../pages/Users/userSlice";
import { RootState } from "../../store";

export function AddRouteDrawer({
  visible,
  onClose,
  fetchRoutes,
}: {
  visible: boolean;
  onClose: () => void;
  fetchRoutes?: () => void;
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // Page state
  const [addLoading, setAddLoading] = useState(false);

  // Data
  const { resState: userRespState, users } = useSelector(
    (state: RootState) => state.user
  );
  const { clients } = useSelector((state: RootState) => state.clients);
  const [routeStates, setRouteStates] = useState<ISettingsParm[]>();
  const [visitTypes, setVisitTypes] = useState<ISettingsParm[]>();
  const [routeFactories, setRouteFactories] = useState<IRouteFactory[]>();
  const [selectedRouteFactorie, setSelectedRouteFactorie] =
    useState<IRouteFactory>();

  //   Side Effects
  useEffect(() => {
    (async function () {
      setRouteFactories(await getRouteFactories());
    })();
    form.setFieldsValue({ scheduledDate: moment(new Date()) });
    if (!users) {
      dispatch(getUsersThunk());
    }
    if (!clients) {
      dispatch(getClientsThunk({}));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    (async function () {
      setRouteStates(await getConfigs(RouteModelNames.routeState));
      setVisitTypes(await getConfigs(RouteModelNames.visitType));
    })();
  }, []);

  useEffect(() => {
    routeStates &&
      form.setFieldsValue({ routeState: routeStates[0]?.objectId });
  }, [routeStates]);
  //   Handlers
  const handleFormSubmit = async (values) => {
    const route: IRoute = {
      assignedTo: { objectId: values.assignedTo },
      routeFactory: { objectId: selectedRouteFactorie?.objectId },
      locality: values.locality,
      scheduledDate: values.scheduledDate?.toDate(),
      routeState: { objectId: values.routeState },
      visits: values.visits?.map(
        (visit: any): IVisit => ({
          client: { objectId: visit?.client },
          type: { objectId: visit?.type },
        })
      ),
    };
    try {
      setAddLoading(true);
      await addRoute(route);
      fetchRoutes();
      setAddLoading(false);
      onClose();
      message.success("Ajouté avec succès");
    } catch (err) {
      setAddLoading(false);
      message.error("Oops..!", 3);
    }
  };

  return (
    <>
      <Drawer
        title={
          <Space>
            <div>Ajouter un itinéraires</div>
            <div style={{ flexGrow: 1 }} />
            <Dropdown
              overlay={
                <Menu>
                  {routeFactories?.map((pack) => (
                    <Menu.Item
                      onClick={() => {
                        setSelectedRouteFactorie(pack);
                        form.setFieldsValue({
                          visits: pack.visits,
                          locality: pack.locality,
                        });
                      }}
                    >
                      {pack.name}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button
                title="Sélectionnez un pack"
                icon={<ArrowDownOutlined />}
                type="primary"
                ghost
              >
                {selectedRouteFactorie?.name ?? "Itinéraires"}
              </Button>
            </Dropdown>
          </Space>
        }
        onClose={onClose}
        visible={visible}
        width="40%"
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
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
              onClick={() => {
                form.submit();
              }}
              loading={addLoading}
            >
              Submit
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFormSubmit}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="Assigné à"
                rules={[{ required: true, message: "Affecter un utilisateur" }]}
              >
                <Select
                  loading={userRespState === "loading"}
                  onSelect={(value) => {
                    dispatch(
                      getClientsThunk({
                        filter: { assignedTo: value as string },
                      })
                    );
                  }}
                >
                  {users?.map((user: any, i: number) => (
                    <Select.Option key={i} value={user.id}>
                      {user.get("username")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="scheduledDate" label="Date">
                <DatePicker format={"DD/MM/YYYY"} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name="locality" label="Localités">
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Sélectionner les Localités"
                  optionFilterProp="children"
                  autoFocus
                  allowClear
                  filterOption={(input, option) => {
                    return (
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {CITIES_LIST?.map((client) => (
                    <Select.Option key={client.value} value={client.value}>
                      {client.value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="routeState"
                label="Etat"
                rules={[{ required: true, message: "Champ requis" }]}
              >
                <Select loading={userRespState === "loading"}>
                  {routeStates?.map((state) => (
                    <Select.Option key={state.objectId} value={state.objectId}>
                      {state.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ marginTop: 0, backgroundColor: "#21212121" }} />
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
                              {clients?.map((client) => (
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
    </>
  );
}
