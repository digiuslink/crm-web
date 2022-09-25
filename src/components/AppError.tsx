import { BugOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import React from "react";

export function AppError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "4rem",
      }}
    >
      <BugOutlined style={{ fontSize: "6rem", color: "tomato" }} />
      <Typography.Title
        level={2}
        style={{ color: "#45454545", marginTop: "1rem", textAlign: "center" }}
      >
        Oops some thing goes wrong...!
      </Typography.Title>
      <Button
        onClick={onRetry}
        type="dashed"
        danger
        size="large"
        icon={<RedoOutlined />}
      >
        Try again
      </Button>
    </div>
  );
}

export default AppError;
