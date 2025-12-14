import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMqtt } from "@/components/contexts/mqtt-context";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const ConnectionHeader: React.FC = () => {
  // SAFE AREA
  const insets = useSafeAreaInsets();

  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  // MQTT CONTEXT
  const { isConnected } = useMqtt();

  // STATES
  const statusText = isConnected ? "Connected" : "Not Connected";
  const statusColor = isConnected ? colorTheme.success : colorTheme.danger;

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
          style={[{ fontWeight: "bold" }, { color: statusColor }]}
        >
          {statusText}
        </ThemedText>
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
