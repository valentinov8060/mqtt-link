export interface ConnectionModel {
  id?: number;
  protocol: "mqtt" | "mqtts";
  host: string;
  port: number;
  tls: boolean;
  username?: string | null;
  password?: string | null;
  autoReconnect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
