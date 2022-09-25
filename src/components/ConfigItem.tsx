import { EditOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Row, Typography } from "antd";

export interface IConfigItemProps {
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  configItem: any;
  deleteLoading?: boolean;
}

export function ConfigItem({
  configItem,
  onEdit,
  onDelete,
  deleteLoading,
}: IConfigItemProps) {
  return (
    <Row
      style={{
        marginLeft: 12,
        marginRight: 12,
        marginTop: 6,
        marginBottom: 6,
      }}
    >
      <Typography.Text
        style={{
          padding: ".3rem",
          border: "solid 1px #21212121",
          width: "70%",
        }}
      >
        {configItem?.name}
      </Typography.Text>
      <div style={{ flex: 1 }} />

      <EditOutlined
        style={{
          padding: 3,
          fontSize: 20,
          color: "#0D4F8C",
          marginLeft: 2,
        }}
        onClick={() => {
          onEdit(configItem);
        }}
      />
      <Popconfirm
        title="Êtes-vous sûr de supprimer ce Type?"
        placement="bottomLeft"
        okText="OUI"
        cancelText="NON"
        okButtonProps={{ loading: deleteLoading }}
        onConfirm={() => onDelete(configItem)}
      >
        <MinusCircleOutlined
          style={{
            padding: 3,
            fontSize: 20,
            color: "tomato",
            marginLeft: 2,
          }}
        />
      </Popconfirm>
    </Row>
  );
}
