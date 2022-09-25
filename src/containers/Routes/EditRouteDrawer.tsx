/* eslint-disable react-hooks/exhaustive-deps */
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVisit,
  getConfigs,
  IRoute,
  ISettingsParm,
  IVisit,
  RouteModelNames,
  updateRoute,
} from "../../api/routes";
import { CITIES_LIST } from "../../assets/data/cities";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { getUsersThunk } from "../../pages/Users/userSlice";
import { RootState } from "../../store";

export function EditRouteDrawer({
  visible,
  onClose,
  routeDetail,
  getRouteDetail,
}: {
  visible: boolean;
  onClose: () => void;
  routeDetail: IRoute;
  getRouteDetail: () => void;
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { resState: userRespState, users } = useSelector(
    (state: RootState) => state.user
  );
  const { clients } = useSelector((state: RootState) => state.clients);

  const [routeStates, setRouteStates] = useState<ISettingsParm[]>();
  const [clientStates, setClientStates] = useState<ISettingsParm[]>();
  const [visitTypes, setVisitTypes] = useState<ISettingsParm[]>();

  //   Side Effects
  useEffect(() => {
    if (!users) {
      dispatch(getUsersThunk());
    }
    dispatch(
      getClientsThunk({
        filter: { assignedTo: routeDetail.assignedTo?.objectId },
      })
    );
  }, []);
  useEffect(() => {
    (async function () {
      setRouteStates(await getConfigs(RouteModelNames.routeState));
      setClientStates(await getConfigs(RouteModelNames.clientState));
      setVisitTypes(await getConfigs(RouteModelNames.visitType));
    })();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      assignedTo: routeDetail?.assignedTo?.objectId,
      scheduledDate: moment(routeDetail.scheduledDate),
      locality: routeDetail.locality,
      routeState: routeDetail.routeState.objectId,
      visits: routeDetail.visits?.map((visit) => {
        return {
          client: visit?.client?.objectId,
          type: visit?.type?.objectId,
          clientState: visit?.clientState?.objectId,
          isVisited: visit?.isVisited,
          note: visit?.note,
          objectId: visit?.objectId,
        };
      }),
    });
  }, []);
  //   Handlers

  const gpsFormat = (gpsString) => {
    const gps = gpsString.split(",");
    const latitude = Number.parseFloat(gps[0]);
    const longitude = Number.parseFloat(gps[1]);
    return { latitude, longitude };
  };

  const handleFormSubmit = async (values) => {
    const route: IRoute = {
      objectId: routeDetail.objectId,
      assignedTo: { objectId: values.assignedTo },
      locality: values.locality,
      scheduledDate: values.scheduledDate?.toDate(),
      routeState: { objectId: values.routeState },
      visits: values.visits?.map(
        (visit: any): IVisit => ({
          client: { objectId: visit?.client },
          type: { objectId: visit?.type },
          gps: visit.gps && gpsFormat(visit.gps),
          isVisited: visit.isVisited,
          clientState: { objectId: visit.clientState },
          objectId: visit.objectId,
        })
      ),
    };
    try {
      await updateRoute(route);
      getRouteDetail();
      onClose();
      message.success("Modifié avec succès");
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      title="Modifier itinéraire"
      width="75%"
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
                        <Col span={6}>
                          <Typography.Text type="secondary" strong>
                            Client
                          </Typography.Text>
                        </Col>
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            Type
                          </Typography.Text>
                        </Col>
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            Etat
                          </Typography.Text>
                        </Col>
                        <Col span={5}>
                          <Typography.Text type="secondary" strong>
                            GPS
                          </Typography.Text>
                        </Col>
                        <Col span={2}>
                          <Typography.Text type="secondary" strong>
                            Visité
                          </Typography.Text>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={6}>
                      <Col span={6}>
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

                      <Col span={5}>
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
                            {visitTypes?.map((type) => {
                              return (
                                <Select.Option
                                  key={type.objectId}
                                  value={type.objectId}
                                >
                                  {type.name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={5}>
                        <Form.Item
                          {...field}
                          name={[field.name, "clientState"]}
                          style={{ marginBottom: 4 }}
                        >
                          <Select placeholder="Etat">
                            {clientStates?.map((client) => (
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
                      <Col span={5}>
                        <Form.Item
                          {...field}
                          name={[field.name, "gps"]}
                          style={{ marginBottom: 4 }}
                        >
                          <Input placeholder="latitude,longitude" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          {...field}
                          name={[field.name, "isVisited"]}
                          valuePropName="checked"
                          style={{ marginBottom: 4 }}
                        >
                          <Switch
                            size="small"
                            unCheckedChildren="non"
                            checkedChildren="oui"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        {fields.length > 0 ? (
                          <Popconfirm
                            title="Êtes-vous sûr de supprimer cette visite"
                            placement="bottomLeft"
                            onConfirm={async () => {
                              if (form.getFieldValue("visits")[field.name]) {
                                const { objectId } =
                                  form.getFieldValue("visits")[field.name];
                                await deleteVisit(objectId);
                              }
                              remove(field.name);
                            }}
                          >
                            <MinusCircleOutlined
                              style={{
                                padding: 4,
                                fontSize: 20,
                                color: "tomato",
                                marginLeft: 2,
                              }}
                            />
                          </Popconfirm>
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
