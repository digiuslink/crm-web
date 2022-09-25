import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Drawer, Form, Button, Col, Input, message, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConfigs, checkConfigExist } from "../../api/configs";
import AppError from "../../components/AppError";
import { getClientConfigsThunk } from "../../core/configSlice";
import { RootState } from "../../store";

import { IDrawerProps } from "./../IDrawer";

export const ClientsSettingsDrawer = ({ onClose, visible }: IDrawerProps) => {
  // Page State
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { resState, clientConfigs } = useSelector(
    (state: RootState) => state.configs
  );
  // State

  // handlers
  const handleOnFormSubmitted = async (values) => {
    try {
      await addConfigs([
        {
          name: "client",
          title: "categories",
          attributes: values?.categories,
        },
        {
          name: "client",
          title: "clientStates",
          attributes: values?.clientStates,
        },
      ]);
      dispatch(getClientConfigsThunk());
      message.success("Ajouté avec succès", 3);
      onClose();
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };
  // request state
  useEffect(() => {
    if (!clientConfigs) dispatch(getClientConfigsThunk());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      categories: clientConfigs?.categories,
      clientStates: clientConfigs?.clientStates,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientConfigs]);
  return (
    <>
      <Drawer
        title="Paramètres clients"
        width={"30%"}
        onClose={onClose}
        visible={visible}
        // bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={() => {
                onClose();
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
        {resState === "loading" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin />
          </div>
        )}
        {resState === "error" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AppError
              onRetry={() => {
                dispatch(getClientConfigsThunk());
              }}
            />
          </div>
        )}
        {resState !== "loading" && resState !== "error" && clientConfigs && (
          <Form
            form={form}
            name="client-settings"
            layout="vertical"
            hideRequiredMark
            onFinish={handleOnFormSubmitted}
            // initialValues={{ categories: clientConfigs?.categories }}
            //   size="small"
          >
            <Col span={24}>
              <Form.List name="categories">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => {
                      return (
                        <Form.Item
                          label={index === 0 ? "Categories" : ""}
                          key={field.key}
                          style={{ margin: 4 }}
                        >
                          <Form.Item
                            {...field}
                            // style={{ margin: 2 }}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                                message: "Le champ ne peut pas être vide",
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="categorie"
                              style={{ width: "70%" }}
                            />
                          </Form.Item>
                          {fields.length > 0 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              style={{
                                padding: 3,
                                fontSize: 20,
                                color: "tomato",
                                marginLeft: 2,
                              }}
                              onClick={async () => {
                                try {
                                  const isDeletable = !(await checkConfigExist(
                                    "category",
                                    form.getFieldValue("categories")[field.name]
                                  ));
                                  if (isDeletable) {
                                    remove(field.name);
                                  } else {
                                    message.error({
                                      content:
                                        "vous ne pouvez pas supprimer la catégorie",
                                    });
                                  }
                                } catch (err) {
                                  message.error(err.message);
                                }
                              }}
                            />
                          ) : null}
                        </Form.Item>
                      );
                    })}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        style={{ width: "100%", marginTop: 12 }}
                      >
                        Ajouter une categorie
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
            <Col span={24}>
              <Form.List name="clientStates">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => {
                      return (
                        <Form.Item
                          label={index === 0 ? "Etat Client" : ""}
                          key={field.key}
                          style={{ margin: 4 }}
                        >
                          <Form.Item
                            {...field}
                            // style={{ margin: 2 }}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                                message: "Le champ ne peut pas être vide",
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="Etat"
                              style={{ width: "70%" }}
                            />
                          </Form.Item>
                          {fields.length > 0 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              style={{
                                padding: 3,
                                fontSize: 20,
                                color: "tomato",
                                marginLeft: 2,
                              }}
                              onClick={async () => {
                                try {
                                  const isDeletable = !(await checkConfigExist(
                                    "clientState",
                                    form.getFieldValue("clientStates")[
                                      field.name
                                    ]
                                  ));
                                  if (isDeletable) {
                                    remove(field.name);
                                  } else {
                                    message.error({
                                      content:
                                        "vous ne pouvez pas supprimer l'état",
                                    });
                                  }
                                } catch (err) {
                                  message.error(err.message);
                                }
                              }}
                            />
                          ) : null}
                        </Form.Item>
                      );
                    })}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        style={{ width: "100%", marginTop: 12 }}
                      >
                        Ajouter une état
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Form>
        )}
      </Drawer>
    </>
  );
};
