import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ConnectionHeaderProps {
  isConnected: boolean;
}

export const ConnectionHeader: React.FC<ConnectionHeaderProps> = ({
  isConnected,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  const statusText = isConnected ? "Connected" : "Not Connected";
  const statusColor = isConnected ? colorTheme.success : colorTheme.danger;

  return (
    <View
      style={[
        styles.container,
        {
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
    borderRadius: 10,
    marginBottom: 16,
  },
});
