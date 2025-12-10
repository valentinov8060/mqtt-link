export interface ConnectionModel {
  id?: number;
  host: string;
  port: number;
  protocol: "mqtt v3" | "mqtt v5";
  ssl: boolean;
  username?: string | null;
  password?: string | null;
  autoReconnect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
