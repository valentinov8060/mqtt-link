import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ErrorModalProps {
  readonly visible: boolean;
  readonly message: string | null;
  readonly onClose: () => void;
}

export function ErrorModal({ visible, message, onClose }: ErrorModalProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: colorTheme.card,
            borderRadius: 14,
            padding: 20,
            maxWidth: 380,
            width: "100%",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colorTheme.border,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 8,
              color: colorTheme.danger,
            }}
          >
            Error
          </Text>

          <Text
            style={{
              fontSize: 15,
              textAlign: "center",
              marginBottom: 22,
              color: colorTheme.text,
            }}
          >
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: colorTheme.danger,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 28,
              width: "100%",
            }}
          >
            <Text
              style={{
                color: colorTheme.background,
                fontWeight: "600",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              Tutup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
