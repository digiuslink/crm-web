import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import styles from "./login.module.css";

function Login({
  handleLogin,
}: {
  // Handlers
  handleLogin: (username: string, password: string) => void;
}) {
  const onFinish = (values: any) => {
    handleLogin(values.username, values.password);
  };

  return (
    <div className={styles.root}>
      <Form
        name="login"
        style={{
          maxWidth: 300,
          marginTop: 24,
          backgroundColor: "white",
          padding: 25,
          borderRadius: 8,
          boxShadow: "1px 2px lightgray",
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className={styles.formItemIcon} />}
            placeholder="Username"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className={styles.formItemIcon} />}
            type="password"
            placeholder="Password"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginBtn}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export { Login };
