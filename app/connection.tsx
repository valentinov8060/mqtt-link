import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { DEFAULT_CONNECTION_CONFIG } from "@/components/contexts/initialization-context";
import { useMqtt } from "@/components/contexts/mqtt-context";
import { ConnectionConfigModal } from "@/components/modals/connection-config-modal";
import { ErrorModal } from "@/components/modals/error-modal";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { ConnectionModel } from "@/src/database/models/connection-model";
import { getConnections } from "@/src/database/repositories/connection-repository";

export default function ConnectionScreen() {
  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  // INITIAL STATES
  const [connectionConfig, setConnectionConfig] = useState<ConnectionModel>(
    DEFAULT_CONNECTION_CONFIG
  );

  // MQTT CONTEXT
  const { connecting } = useMqtt();

  // MODAL STATES
  const [connectionConfigModalVisible, setConnectionConfigModalVisible] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // USE EFFECT
  const hasInitialized = useRef(false);
  useEffect(() => {
    const fetchConnectionConfig = async () => {
      const connections = await getConnections();
      if (!hasInitialized.current && connections.length > 0) {
        setConnectionConfig(connections[0]);
        hasInitialized.current = true;
      }
    };

    fetchConnectionConfig();
  }, []);

  // HANDLER
  const connectionHandler = async () => {
    try {
      await connecting(connectionConfig!);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setShowErrorModal(true);
      console.error("connectionHandler Error: " + (error as any));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.connectionCardContainer,
          { backgroundColor: colorTheme.card },
        ]}
      >
        <Pressable
          onPress={() => setConnectionConfigModalVisible(true)}
          style={[styles.connectionCard]}
        >
          <Text
            style={[
              styles.baseText,
              styles.semiBold,
              { color: colorTheme.text },
            ]}
          >
            Host:{" "}
            <Text style={[styles.baseText, { color: colorTheme.text }]}>
              {connectionConfig.host !== null &&
              connectionConfig.host !== undefined &&
              connectionConfig.host !== ""
                ? connectionConfig.host
                : "Not Set"}
            </Text>
          </Text>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={colorTheme.text}
          />
        </Pressable>

        <TouchableOpacity
          style={[styles.connectBtn, { backgroundColor: colorTheme.success }]}
          onPress={connectionHandler}
        >
          <Text style={styles.connectBtnText}>Connect</Text>
        </TouchableOpacity>

        <ConnectionConfigModal
          isVisible={connectionConfigModalVisible}
          onClose={() => setConnectionConfigModalVisible(false)}
          connectionConfig={connectionConfig}
          setConnectionConfig={setConnectionConfig}
        />
      </View>

      <ErrorModal
        visible={showErrorModal}
        message={error}
        onClose={() => setShowErrorModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* Connection Card Container */
  connectionCardContainer: {
    marginTop: 20,
    width: "100%",
    gap: 14,
    borderRadius: 12,
  },
  connectionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  /* Text */
  baseText: {
    fontSize: 16,
  },
  semiBold: {
    fontWeight: "600",
  },

  connectBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  connectBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
