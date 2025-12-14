import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useMqtt } from "@/components/contexts/mqtt-context";
import { initConnections } from "@/src/database/migrations/connections-migration";
import { initWidgets } from "@/src/database/migrations/widgets-migration";
import { ConnectionModel } from "@/src/database/models/connection-model";
import { WidgetModel } from "@/src/database/models/widget-model";
import {
  addConnection,
  getConnections,
} from "@/src/database/repositories/connection-repository";
import { getWidgets } from "@/src/database/repositories/widget-repository";

const DEFAULT_CONNECTION_CONFIG: ConnectionModel = {
  id: 1,
  protocol: "mqtt",
  host: "",
  port: 1883,
  tls: false,
  username: null,
  password: null,
  autoReconnect: true,
};

interface InitializationContextProps {
  initialConnectionConfig: ConnectionModel;
  initialWidgets: WidgetModel[];
}

const InitializationContext = createContext<
  InitializationContextProps | undefined
>(undefined);

export const InitializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialConnectionConfig, setInitialConnectionConfig] =
    useState<ConnectionModel>(DEFAULT_CONNECTION_CONFIG);
  const [initialWidgets, setInitialWidgets] = useState<WidgetModel[]>([]);

  const { connecting } = useMqtt();

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize database tables
        await initConnections();
        await initWidgets();

        // Check if there is a connection, if not add a default one
        const connections = await getConnections();
        if (connections.length === 0) {
          await addConnection(DEFAULT_CONNECTION_CONFIG);
          setInitialConnectionConfig(DEFAULT_CONNECTION_CONFIG);
        } else {
          setInitialConnectionConfig(connections[0]);

          // Auto connect if enabled
          if (connections[0].autoReconnect) {
            await connecting(connections[0]);
          }
        }

        // Get widgets
        const widgets = await getWidgets();
        setInitialWidgets(widgets);
      } catch (error) {
        console.error("Init error: ", error);
      }
    };
    init();
  }, []);

  return (
    <InitializationContext.Provider
      value={useMemo(
        () => ({ initialConnectionConfig, initialWidgets }),
        [initialConnectionConfig, initialWidgets]
      )}
    >
      {children}
    </InitializationContext.Provider>
  );
};

// CUSTOM HOOKS
export const useInitialConnectionConfig = () => {
  const ctx = useContext(InitializationContext);
  if (!ctx)
    throw new Error(
      "useInitialConnectionConfig Error: must be used inside InitializationProvider"
    );
  return ctx.initialConnectionConfig;
};

export const useInitialWidgets = () => {
  const ctx = useContext(InitializationContext);
  if (!ctx)
    throw new Error(
      "useInitialWidgets Error: must be used inside InitializationProvider"
    );
  return ctx.initialWidgets;
};
