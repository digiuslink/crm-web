import { IClient } from "../pages/Clients/IClient";

export interface IDrawerProps {
  visible: boolean;
  onClose: () => void;
  loading?: boolean;
  client?: IClient;
}
