import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ConnectionModel } from "@/src/database/models/connection-model";
import {
  connectingMqtt,
  disconnectMqtt,
  mqttPublish,
  mqttSubscribe,
  mqttUnsubscribe,
  setMqttMessageHandler,
} from "@/src/services/mqtt-service";

export interface MqttContextProps {
  isConnected: boolean;
  connecting: (connectionConfig: ConnectionModel) => Promise<void>;
  disconnect: () => Promise<void>;
  publish: (topic: string, payload: string, qos: number) => Promise<void>;
  subscribe: (topic: string) => Promise<any>;
  unsubscribe: (topic: string) => Promise<void>;
  messages: Record<string, string>;
}

export const MqttContext = createContext<MqttContextProps | null>(null);

export function MqttProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // STATES
  const [isConnected, setIsConnected] = useState(false);

  const connecting = useCallback(async (connectionConfig: ConnectionModel) => {
    try {
      await connectingMqtt(connectionConfig, {
        onConnect: () => setIsConnected(true),
        onClose: () => setIsConnected(false),
        onError: () => setIsConnected(false),
      });
    } catch (error) {
      setIsConnected(false);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectMqtt();
    setIsConnected(false);
  }, []);

  const publish = useCallback(
    async (topic: string, payload: string, qos: number) => {
      await mqttPublish(topic, payload, qos);
    },
    []
  );

  const subscribe = useCallback(async (topic: string) => {
    await mqttSubscribe(topic);
  }, []);

  const unsubscribe = useCallback(async (topic: string) => {
    await mqttUnsubscribe(topic);
  }, []);

  const [messages, setMessages] = useState<Record<string, string>>({});

  // USE EFFECT
  useEffect(() => {
    setMqttMessageHandler((topic, payload) => {
      setMessages((prev) => ({
        ...prev,
        [topic]: payload,
      }));
    });
  }, []);

  return (
    <MqttContext.Provider
      value={useMemo(
        () => ({
          isConnected,
          connecting,
          disconnect,
          publish,
          subscribe,
          unsubscribe,
          messages,
        }),
        [
          isConnected,
          connecting,
          disconnect,
          publish,
          subscribe,
          unsubscribe,
          messages,
        ]
      )}
    >
      {children}
    </MqttContext.Provider>
  );
}

export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) {
    throw new Error("useMqtt Error: must be used inside MqttProvider");
  }
  return ctx;
};
