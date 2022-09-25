import {
  Drawer,
  Form,
  Button,
  Col,
  message,
  Spin,
  Select,
  Row,
  AutoComplete,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CITIES_LIST } from "../../assets/data/cities";

import { IClientFilter } from "../../api/client";
import { getUsers } from "../../api/users";
import AppError from "../../components/AppError";
import { getClientConfigsThunk } from "../../core/configSlice";
import { getClientsThunk } from "../../pages/Clients/clientsSlice";
import { RootState } from "../../store";

import { IDrawerProps } from "./../IDrawer";
import { setClientFilters, setClientFiltersCount } from "../../core/appSlice";
import { UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

export const FilterClientsDrawer = ({ onClose, visible }: IDrawerProps) => {
  // Page State
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { resState, clientConfigs } = useSelector(
    (state: RootState) => state.configs
  );
  const { clientFilter } = useSelector((state: RootState) => state.app);
  // State
  const [users, setUsers] = useState<any>();
  const [filtredWilaya, setFiltredWilaya] = useState([]);

  // handlers
  const handleOnFormSubmitted = async (values: IClientFilter) => {
    try {
      dispatch(getClientsThunk({ filter: values })); // Get filtred clients
      dispatch(setClientFilters(values));
      dispatch(
        setClientFiltersCount(
          Object.entries(values)
            .map((entry) => entry[1])
            .filter((entry) => entry !== undefined).length
        )
      );
      onClose();
      // dispatch(setClientFiltersCount())
    } catch (err) {
      message.error("Oops..!", 3);
    }
  };
  // request state
  useEffect(() => {
    if (!clientConfigs) dispatch(getClientConfigsThunk());
    (async function () {
      if (!users) setUsers(await getUsers());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      category: clientFilter?.category,
      addedBy: clientFilter.addedBy,
      wilaya: clientFilter.wilaya,
      isVerified: clientFilter.isVerified,
      clientState: clientFilter.clientState,
      assignedTo: clientFilter.assignedTo,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientConfigs]);
  return (
    <>
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
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label="Categorie" name="category">
                  <Select allowClear placeholder="categorie">
                    {clientConfigs?.categories?.map((ctg: string) => (
                      <Option value={ctg}>{ctg}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Ajouter par" name="addedBy">
                  <Select allowClear placeholder="ajouter par">
                    {users?.map((user: any) => (
                      <Option value={user.id}>{user.get("username")}</Option>
                    ))}
                    )
                  </Select>
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
                    onSearch={(value) => {
                      setFiltredWilaya(
                        CITIES_LIST.filter((ct) =>
                          ct.value.toLowerCase().includes(value.toLowerCase())
                        )
                      );
                    }}
                    placeholder="wilaya"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isVerified" label="Verifier?">
                  {/* <Input placeholder="Entrer la wilaya" /> */}
                  <Select
                    // style={{ width: 120 }}
                    allowClear
                    placeholder="Verifier?"
                  >
                    <Option value={true as any}>OUI</Option>

                    <Option value={false as any}>NON</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="clientState" label="Etat client">
                  {/* <Input placeholder="Entrer la wilaya" /> */}
                  <Select
                    // style={{ width: 120 }}
                    allowClear
                    placeholder="Etat client"
                  >
                    {clientConfigs?.clientStates?.map((cs: string) => (
                      <Option value={cs}>{cs}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="assignedTo" label="Assigné à ">
                  {/* <Input placeholder="Entrer la wilaya" /> */}
                  <Select allowClear placeholder="Assigné à">
                    {users?.map((user: any) => (
                      <Option value={user.id}>{user.get("username")}</Option>
                    ))}
                    )
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    </>
  );
};
