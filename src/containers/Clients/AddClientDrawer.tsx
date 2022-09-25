import {
  EnvironmentOutlined,
  FacebookOutlined,
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  message,
  AutoComplete,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CITIES_LIST } from "../../assets/data/cities";
import ALL_CITIES from "../../assets/data/cities.json";
import { getClientConfigsThunk } from "../../core/configSlice";
import { capitalizeFirstLetter } from "../../core/helpers";
import {
  addClientThunk,
  setClientAddedFalse,
} from "../../pages/Clients/clientSlice";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { getUsersThunk } from "../../pages/Users/userSlice";
import { RootState } from "../../store";

import { IDrawerProps } from "../IDrawer";

const { Option } = Select;

export const AddClientDrawer = ({ onClose, visible }: IDrawerProps) => {
  // Page State
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { error, errorMsg, addLoading, clientAdded } = useSelector(
    (state: RootState) => state.client
  );
  const [filtredWilaya, setFiltredWilaya] = useState([]);
  const [wilaya, setWilaya] = useState("");

  const [allCities, setAllCities] = useState([]);
  const [filtredCities, setFiltredCities] = useState([]);

  // State
  const { clientConfigs, resState } = useSelector(
    (state: RootState) => state.configs
  );

  const { resState: userRespState, users } = useSelector(
    (state: RootState) => state.user
  );

  // handlers
  const handleOnFormSubmitted = (values: any) => {
    values.fullName = capitalizeFirstLetter(values.fullName);
    values.key = values.fullName;
    if (values.gps) {
      const gps = values.gps.split(",");
      const latitude = Number.parseFloat(gps[0]);
      const longitude = Number.parseFloat(gps[1]);
      values.gps = { latitude, longitude };
    }
    values.isVerified = false;
    values.assignedTo = users[values.assignedTo];
    dispatch(addClientThunk(values));
  };

  // Effects

  useEffect(() => {
    if (error) message.error(errorMsg);
  }, [error, errorMsg]);

  useEffect(() => {
    if (clientAdded) {
      message.success("Ajouté avec succès");
      form.resetFields();
      onClose();
      dispatch(setClientAddedFalse());
      dispatch(getClientsThunk({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientAdded]);

  useEffect(() => {
    setAllCities(ALL_CITIES.filter((ct) => ct.wilaya_name === wilaya));
  }, [wilaya]);

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
        title="Ajouter un client"
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
              loading={addLoading}
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
          name="add-client"
          layout="vertical"
          hideRequiredMark
          onFinish={handleOnFormSubmitted}
          //   size="small"
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Nom du client"
                rules={[{ required: true, message: "Enter le nom du client" }]}
              >
                <Input placeholder="Nom du client" prefix={<UserOutlined />} />
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
                {/* <Input placeholder="Entrer la wilaya" /> */}
                <AutoComplete
                  options={
                    filtredWilaya.length === 0 ? CITIES_LIST : filtredWilaya
                  }
                  // style={{ width: 200 }}
                  allowClear={true}
                  onClear={() => setWilaya("")}
                  onSearch={(value) => {
                    setFiltredWilaya(
                      CITIES_LIST.filter((ct) =>
                        ct.value.toLowerCase().includes(value.toLowerCase())
                      )
                    );
                    setWilaya(value);
                  }}
                  onSelect={(value) => {
                    setWilaya(value);
                  }}
                  placeholder="wilaya"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commune" label="Commune">
                {/* <Input placeholder="Entrer la Commune" /> */}
                <AutoComplete
                  options={
                    filtredCities.length === 0
                      ? allCities.map((ct) => ({
                          value: ct.commune_name,
                        }))
                      : filtredCities
                  }
                  // style={{ width: 200 }}

                  onSearch={(value) => {
                    setFiltredCities(
                      allCities
                        .filter((ct) =>
                          ct.commune_name
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        )
                        .map((ct) => ({ value: ct.commune_name }))
                    );
                  }}
                  allowClear={true}
                  placeholder="commune"
                />
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
                  placeholder="latitude, longitude"
                  prefix={<EnvironmentOutlined />}
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
              <Form.Item
                name="assignedTo"
                label="Assigné à"
                rules={[{ required: true, message: "Affecter un utilisateur" }]}
              >
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
