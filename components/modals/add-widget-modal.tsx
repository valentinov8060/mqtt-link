import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddWidgetModalProps {
  readonly visible: boolean;
  readonly name: string;
  readonly topic: string;
  readonly onChangeName: (text: string) => void;
  readonly onChangeTopic: (text: string) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

export function AddWidgetModal({
  visible,
  name,
  topic,
  onChangeName,
  onChangeTopic,
  onSubmit,
  onCancel,
}: AddWidgetModalProps) {
  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: colorTheme.card,
              borderColor: colorTheme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colorTheme.text }]}>
            Add Widget
          </Text>

          <TextInput
            value={name}
            placeholder="Label (ex: Temperature)"
            placeholderTextColor={colorTheme.icon}
            onChangeText={onChangeName}
            style={[
              styles.input,
              { borderColor: colorTheme.border, color: colorTheme.text },
            ]}
          />

          <TextInput
            value={topic}
            placeholder="Topic MQTT (ex: sensor/temp)"
            placeholderTextColor={colorTheme.icon}
            onChangeText={onChangeTopic}
            style={[
              styles.input,
              { borderColor: colorTheme.border, color: colorTheme.text },
            ]}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colorTheme.tint }]}
              onPress={onSubmit}
            >
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colorTheme.danger }]}
              onPress={onCancel}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "88%",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
