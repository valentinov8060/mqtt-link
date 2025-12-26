export interface ConnectionModel {
  id?: number;
  protocol: "mqtt" | "mqtts";
  host: string;
  port: number;
  tls: boolean;
  username?: string | null;
  password?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
