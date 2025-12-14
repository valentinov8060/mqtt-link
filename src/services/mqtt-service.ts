import { ConnectionModel } from "@/src/database/models/connection-model";
import MQTT from "sp-react-native-mqtt";

let mqttClient: any = null;

/**
 * Disconnect current MQTT client safely
 */
export const disconnectMqtt = async () => {
  if (mqttClient) {
    try {
      await mqttClient.disconnect();
      console.log("disconnectMqtt executed successfully");
    } catch (error) {
      console.error("disconnectMqtt Error: ", error);
      throw new Error("disconnectMqtt Error:" + (error as any));
    } finally {
      mqttClient = null;
    }
  }
};

/**
 * Create new MQTT connection based on configuration
 */
export const connectingMqtt = async (
  config: ConnectionModel,
  callbacks?: {
    onConnect?: () => void;
    onClose?: () => void;
    onError?: (err: any) => void;
  }
) => {
  await disconnectMqtt();

  try {
    const payloadCreateClient: any = {
      uri: `${config.protocol}://${config.host}:${config.port}`,
      tls: config.tls,
      keepalive: 60,
      clientId: `rn-client-${Math.random().toString(16).slice(2)}`,
    };
    if (config.username && config.password) {
      payloadCreateClient.auth = true;
      payloadCreateClient.user = config.username;
      payloadCreateClient.pass = config.password;
    }

    const client = await MQTT.createClient(payloadCreateClient);

    // Event listeners
    client.on("connect", () => {
      console.log("MQTT Connected");
      callbacks?.onConnect?.();
    });

    client.on("closed", () => {
      console.log("MQTT Closed");
      callbacks?.onClose?.();
    });

    client.on("error", (err) => {
      console.log("MQTT Error:", err);
      callbacks?.onError?.(err);
    });

    client.on("message", (msg: any) => {
      const payload =
        typeof msg.data === "string"
          ? msg.data
          : Buffer.from(msg.data).toString();

      onMessageCallback?.(msg.topic, payload);
    });

    client.connect();

    mqttClient = client;
    return client;
  } catch (error) {
    console.error("mqttConnecting Error: ", error);
    throw new Error("mqttConnecting Error: " + (error as any));
  }
};

/**
 * Publish message
 */
export const mqttPublish = async (topic: string, payload: string) => {
  if (!mqttClient) {
    console.error("mqttPublish Error: MQTT client is not connected.");
    throw new Error("mqttPublish Error: MQTT client is not connected.");
  }

  try {
    await mqttClient.publish(topic, payload, 0, false);
    console.log(
      `mqttPublish executed successfully. Topic: ${topic}, Payload: ${payload}`
    );
  } catch (error) {
    console.error("mqttPublish Error: ", error);
    throw new Error("mqttPublish Error: " + (error as any));
  }
};

/**
 * Subscribe to topic
 */
export const mqttSubscribe = async (topic: string) => {
  if (!mqttClient) {
    console.error("mqttSubscribe Error: MQTT client is not connected.");
    throw new Error("mqttSubscribe Error: MQTT client is not connected.");
  }

  try {
    const payload = await mqttClient.subscribe(topic, 0);
    console.log(`mqttSubscribe executed successfully. Topic: ${topic}`);
    return payload;
  } catch (error) {
    console.error("mqttSubscribe Error: ", error);
    throw new Error("mqttSubscribe Error: " + (error as any));
  }
};

/**
 * Unsubscribe from topic
 */
export const mqttUnsubscribe = async (topic: string) => {
  if (!mqttClient) {
    console.error("mqttUnsubscribe Error: MQTT client is not connected.");
    throw new Error("mqttUnsubscribe Error: MQTT client is not connected.");
  }

  try {
    await mqttClient.unsubscribe(topic);
    console.log(`mqttUnsubscribe executed successfully. Topic: ${topic}`);
  } catch (error) {
    console.error("mqttUnsubscribe Error: ", error);
    throw new Error("mqttUnsubscribe Error: " + (error as any));
  }
};

/**
 * Set message handler callback
 */
let onMessageCallback: ((topic: string, payload: string) => void) | null = null;
export const setMqttMessageHandler = (
  handler: (topic: string, payload: string) => void
) => {
  onMessageCallback = handler;
};
