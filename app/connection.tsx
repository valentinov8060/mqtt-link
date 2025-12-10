import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useConnection } from "@/components/contexts/initialization-context";
import { ConnectionHeader } from "@/components/headers/connection-header";
import { ConnectionConfigModal } from "@/components/modals/connection-config-modal";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { ConnectionModel } from "@/src/database/models/connection-model";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConnectionScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  const isConnected = true;

  const connection: ConnectionModel = useConnection();
  const [connectionConfig, setConnectionConfig] =
    useState<ConnectionModel>(connection);

  const [connectionConfigModalVisible, setConnectionConfigModalVisible] =
    useState(false);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ConnectionHeader isConnected={isConnected} />

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
              {connectionConfig.host || "Not Set"}
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
          onPress={() => {
            /* TODO: call connect function */
            console.log("Connect button pressed");
          }}
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
