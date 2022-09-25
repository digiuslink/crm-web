import { UndoOutlined } from "@ant-design/icons";
import {
  Drawer,
  Form,
  Button,
  Col,
  Select,
  Row,
  Tooltip,
  DatePicker,
} from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBlfFilters, setBlfFiltersCount } from "../../core/appSlice";
import { getBlfsThunk } from "../../pages/BLFs/blfSlice";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { getUsersThunk } from "../../pages/Users/userSlice";
import { RootState } from "../../store";
import { IDrawerProps } from "../IDrawer";

function FilterBlfsDrawer({ onClose, visible }: IDrawerProps) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { clients } = useSelector((state: RootState) => state.clients);
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!clients) {
      dispatch(getClientsThunk({}));
    }
    if (!users) {
      dispatch(getUsersThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, users]);

  const { blfFilter } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    form.setFieldsValue({
      client: blfFilter.client,
      assignedTo: blfFilter.assignedTo?.id,
    });
    blfFilter.blfDate &&
      form.setFieldsValue({ blfDate: moment(blfFilter.blfDate) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleOnFormSubmitted = async (values: any) => {
    try {
      values.blfDate = values.blfDate?.toDate();
      //   values.assignedTo &&
      //     (values.assignedTo = users.filter((user: any) => {
      //       return user.objectId === values.objectId;
      //     }));
      if (values.assignedTo) {
        const user = users.filter((user: any) => {
          return user.id === values.assignedTo;
        })[0];
        values.assignedTo = user;
      }
      dispatch(getBlfsThunk({ filter: values }));
      dispatch(setBlfFilters(values));
      dispatch(
        setBlfFiltersCount(
          Object.entries(values)
            .map((entry) => entry[1])
            .filter((entry) => entry !== undefined).length
        )
      );
      onClose();
    } catch (err) {}
  };

  return (
    <Drawer
      title={
        <Row gutter={12}>
          <Col>Filtrer par</Col>
          <Col>
            <Tooltip title="Reset">
              <UndoOutlined
                style={{ color: "#666666" }}
                onClick={() => {
                  form.resetFields();
                }}
              />
            </Tooltip>
          </Col>
        </Row>
      }
      width={"30%"}
      onClose={onClose}
      visible={visible}
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
      <Form
        form={form}
        name="client-settings"
        layout="vertical"
        hideRequiredMark
        onFinish={handleOnFormSubmitted}
        // initialValues={{ categories: clientConfigs?.categories }}
        //   size="small"
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Client" name="client">
              <Select
                showSearch
                allowClear
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
                  <Select.Option key={client.objectId} value={client.objectId}>
                    {client.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="blfDate" label="Date">
              <DatePicker
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="assignedTo" label="Assigné à ">
              {/* <Input placeholder="Entrer la wilaya" /> */}
              <Select allowClear placeholder="Assigné à">
                {users?.map((user: any) => (
                  <Select.Option value={user.id}>
                    {user.get("username")}
                  </Select.Option>
                ))}
                )
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}

export default FilterBlfsDrawer;
