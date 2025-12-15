import React, { createContext, useEffect } from "react";

import { useMqtt } from "@/components/contexts/mqtt-context";
import { initConnections } from "@/src/database/migrations/connections-migration";
import { initWidgets } from "@/src/database/migrations/widgets-migration";
import { ConnectionModel } from "@/src/database/models/connection-model";
import {
  addConnection,
  getConnections,
} from "@/src/database/repositories/connection-repository";

export const DEFAULT_CONNECTION_CONFIG: ConnectionModel = {
  id: 1,
  protocol: "mqtt",
  host: "",
  port: 1883,
  tls: false,
  username: null,
  password: null,
  autoReconnect: true,
};

const InitializationContext = createContext<undefined>(undefined);

export const InitializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connecting } = useMqtt();

  useEffect(() => {
    const init = async () => {
      try {
        await initConnections();
        await initWidgets();

        const connections = await getConnections();

        if (connections.length === 0) {
          await addConnection(DEFAULT_CONNECTION_CONFIG);
        } else if (connections[0].autoReconnect) {
          await connecting(connections[0]);
        }
      } catch (err: any) {
        console.error("Init error:", err);
      }
    };

    init();
  }, [connecting]);

  return (
    <InitializationContext.Provider value={undefined}>
      {children}
    </InitializationContext.Provider>
  );
};
