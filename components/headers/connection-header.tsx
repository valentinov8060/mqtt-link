import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMqtt } from "@/components/contexts/mqtt-context";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getConnections } from "@/src/database/repositories/connection-repository";

export const ConnectionHeader: React.FC = () => {
  // SAFE AREA
  const insets = useSafeAreaInsets();

  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  // MQTT CONTEXT
  const { connecting, isConnected } = useMqtt();

  // STATES
  const statusText = isConnected ? "Connected" : "Not Connected";
  const statusColor = isConnected ? colorTheme.success : colorTheme.danger;

  // HANDLER
  const headerConnectionHandler = async () => {
    try {
      const connections = await getConnections();
      await connecting(connections[0]);
    } catch (error) {
      console.error("connectionHandler Error: " + (error as any));
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: insets.top,
          backgroundColor: colorTheme.card,
          borderColor: colorTheme.border,
          borderWidth: 1,
        },
      ]}
    >
      <ThemedText type="subtitle">
        Status:{" "}
        <ThemedText
          type="subtitle"
          style={{ fontWeight: "bold", color: statusColor }}
        >
          {statusText}
        </ThemedText>
      </ThemedText>
      <TouchableOpacity onPress={headerConnectionHandler}>
        <MaterialCommunityIcons
          name="reload"
          size={28}
          color={colorTheme.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
