/* eslint-disable no-useless-escape */
import {
  FacebookOutlined,
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Drawer, Form, Button, Col, Row, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientConfigsThunk } from "../../core/configSlice";
import {
  editClientThunk,
  getClientThunk,
} from "../../pages/Clients/clientSlice";
import { getUsersThunk } from "../../pages/Users/userSlice";
import { RootState } from "../../store";

import { IDrawerProps } from "../IDrawer";

const { Option } = Select;

export const EditClientDrawer = ({
  onClose,
  visible,
  client,
}: IDrawerProps) => {
  // Page State
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { clientEdited } = useSelector((state: RootState) => state.client);
  // State
  const { clientConfigs, resState } = useSelector(
    (state: RootState) => state.configs
  );

  const { resState: userRespState, users } = useSelector(
    (state: RootState) => state.user
  );

  // handlers
  const handleOnFormSubmitted = (values: any) => {
    values.objectId = client?.objectId;
    if (values?.gps) {
      const gps = values?.gps?.split(",");
      const latitude = Number.parseFloat(gps[0]);
      const longitude = Number.parseFloat(gps[1]);
      values.gps = { latitude, longitude };
    }

    values.assignedTo = users[values.assignedTo];

    dispatch(editClientThunk(values));
    dispatch(getClientThunk(client?.objectId));
  };

  useEffect(() => {
    if (clientEdited === "changed") {
      message.success("Modifier avec succès");
      form.resetFields();
      onClose();
    } else if (clientEdited === "error") {
      message.error("Oops..!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientEdited]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(client);
      form.setFieldsValue({
        gps: `${client?.gps?.latitude}, ${client?.gps?.longitude}`,
        assignedTo: client?.assignedTo?.username,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!clientConfigs) dispatch(getClientConfigsThunk());
    if (!users) {
      dispatch(getUsersThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Drawer
        title="Modifier un client"
        width={"50%"}
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
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              loading={clientEdited === "loading"}
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
          name="edit-client"
          layout="vertical"
          hideRequiredMark
          onFinish={handleOnFormSubmitted}
          //   size="small"
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Nom et Prénom"
                rules={[{ required: true, message: "Enter le nom du client" }]}
              >
                <Input placeholder="Nom et Prénom" prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="wcom" label="WCOM ">
                <Input
                  placeholder="Entrer WCOM-ID"
                  prefix={<IdcardOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name="wilaya" label="Wilaya">
                <Input placeholder="Entrer la wilaya" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commune" label="Commune">
                <Input placeholder="Entrer la Commune" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="address" label="Adresse">
                <Input
                  placeholder="Adresse du client"
                  prefix={<HomeOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gps" label="GPS">
                <Input
                  placeholder="Adresse du client"
                  prefix={<HomeOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24 / 3}>
              <Form.Item name="tel_1" label="Tel-01">
                <Input placeholder="0770707070" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24 / 3}>
              <Form.Item name="tel_2" label="Tel-02">
                <Input placeholder="0660606060" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24 / 3}>
              <Form.Item name="tel_3" label="Tel-03">
                <Input placeholder="0550505050" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email n'est pas valide" }]}
              >
                <Input
                  placeholder="Email du client"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="facebook" label="Facebook">
                <Input
                  placeholder="Lien facebook"
                  prefix={<FacebookOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category">
                <Select loading={resState === "loading"}>
                  {clientConfigs?.categories.map((ctg: string, i: number) => (
                    <Option key={i} value={ctg}>
                      {ctg}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="clientState" label="Etat client">
                <Select loading={resState === "loading"}>
                  {clientConfigs?.clientStates.map((cs: string, i: number) => (
                    <Option key={i} value={cs}>
                      {cs}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="assignedTo" label="assigné à">
                <Select loading={userRespState === "loading"}>
                  {users?.map((user: any, i: number) => (
                    <Option key={i} value={i}>
                      {user.get("username")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="note" label="Note">
                <Input.TextArea rows={2} placeholder="Enter une note" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
