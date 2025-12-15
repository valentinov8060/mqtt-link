import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { ErrorModal } from "@/components/modals/error-modal";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

import { useMqtt } from "@/components/contexts/mqtt-context";

export default function PublishScreen() {
  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  // MQTT CONTEXT
  const { isConnected, publish } = useMqtt();

  // STATES
  const [topic, setTopic] = useState("");
  const [payload, setPayload] = useState("");
  const [qos, setQos] = useState(0);

  // MODAL STATES
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // HANDLERS
  const publishHandler = async () => {
    try {
      if (!isConnected) {
        throw new Error("MQTT is not connected.");
      }
      await publish(topic, payload, qos);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setShowErrorModal(true);
      console.error("handlePublish Error: ", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.publishInputContainer}>
        <TextInput
          placeholder="Topic MQTT (ex: sensor/temp)"
          placeholderTextColor={colorTheme.icon}
          style={[
            styles.input,
            { borderColor: colorTheme.border, color: colorTheme.text },
          ]}
          value={topic}
          onChangeText={setTopic}
        />

        <TextInput
          placeholder="Payload (ex: 29.5)"
          placeholderTextColor={colorTheme.icon}
          style={[
            styles.input,
            styles.payloadInput,
            { borderColor: colorTheme.border, color: colorTheme.text },
          ]}
          multiline
          value={payload}
          onChangeText={setPayload}
        />

        <View style={styles.qosInputContainer}>
          <Text style={[styles.qosInputLabel, { color: colorTheme.text }]}>
            QoS Level
          </Text>

          <View style={styles.qosInputOptions}>
            {[0, 1, 2].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setQos(level)}
                style={[
                  styles.qosInputOption,
                  {
                    borderColor: colorTheme.border,
                    backgroundColor:
                      qos === level ? colorTheme.tint + "20" : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color: qos === level ? colorTheme.tint : colorTheme.text,
                    fontWeight: qos === level ? "600" : "400",
                  }}
                >
                  QoS {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.publishBtn, { backgroundColor: colorTheme.tint }]}
          onPress={publishHandler}
        >
          <Text style={styles.publishBtnText}>Publish</Text>
        </TouchableOpacity>
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
  publishInputContainer: {
    marginTop: 20,
    width: "100%",
    gap: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  payloadInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  qosInputContainer: {
    marginTop: 12,
  },
  qosInputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  qosInputOptions: {
    flexDirection: "row",
  },
  qosInputOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  publishBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  publishBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
