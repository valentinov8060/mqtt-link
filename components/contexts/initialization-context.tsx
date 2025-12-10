import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { initConnections } from "@/src/database/migrations/connections-migration";
import { initWidgets } from "@/src/database/migrations/widgets-migration";
import { ConnectionModel } from "@/src/database/models/connection-model";
import { WidgetModel } from "@/src/database/models/widget-model";
import {
  addConnection,
  getConnections,
} from "@/src/database/repositories/connection-repository";
import { getWidgets } from "@/src/database/repositories/widget-repository";

const DEFAULT_CONNECTION: ConnectionModel = {
  id: 1,
  host: "",
  port: 1883,
  protocol: "mqtt v3",
  ssl: false,
  username: null,
  password: null,
  autoReconnect: true,
};

interface InitializationContextProps {
  connection: ConnectionModel;
  widgets: WidgetModel[];
}

const InitializationContext = createContext<
  InitializationContextProps | undefined
>(undefined);

export const InitializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] =
    useState<ConnectionModel>(DEFAULT_CONNECTION);
  const [widgets, setWidgets] = useState<WidgetModel[]>([]);

  useEffect(() => {
    const init = async () => {
      // Initialize database tables
      await initConnections();
      await initWidgets();

      // Check if there is a connection, if not add a default one
      const connections = await getConnections();
      if (connections.length === 0) {
        await addConnection(DEFAULT_CONNECTION);
      } else {
        setConnection(connections[0]);
      }

      // Get widgets
      const widgets = await getWidgets();
      setWidgets(widgets);
    };

    init();
  }, []);

  return (
    <InitializationContext.Provider
      value={useMemo(() => ({ connection, widgets }), [connection, widgets])}
    >
      {children}
    </InitializationContext.Provider>
  );
};

// CUSTOM HOOKS
export const useConnection = () => {
  const ctx = useContext(InitializationContext);
  if (!ctx)
    throw new Error("useConnection must be used inside InitializationProvider");
  return ctx.connection;
};

export const useWidgets = () => {
  const ctx = useContext(InitializationContext);
  if (!ctx)
    throw new Error("useWidgets must be used inside InitializationProvider");
  return ctx.widgets;
};
