import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { useMqtt } from "@/components/contexts/mqtt-context";
import { ErrorModal } from "@/components/modals/error-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ConnectionModel } from "@/src/database/models/connection-model";
import { updateConnection } from "@/src/database/repositories/connection-repository";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ConnectionConfigModalProps {
  isVisible: boolean;
  onClose: () => void;
  connectionConfig: ConnectionModel;
  setConnectionConfig: React.Dispatch<React.SetStateAction<ConnectionModel>>;
}

export const ConnectionConfigModal: React.FC<ConnectionConfigModalProps> = ({
  isVisible,
  onClose,
  connectionConfig,
  setConnectionConfig,
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];
  const themedTextInputStyle = {
    backgroundColor: colorTheme.background,
    color: colorTheme.text,
    borderColor: colorTheme.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  };

  const { connecting } = useMqtt();

  const [protocol, setProtocol] = useState(connectionConfig.protocol);
  const [host, setHost] = useState(connectionConfig.host ?? "");
  const [port, setPort] = useState(connectionConfig.port);
  const [tls, setTls] = useState(connectionConfig.tls);
  const [username, setUsername] = useState(connectionConfig.username || "");
  const [password, setPassword] = useState(connectionConfig.password || "");
  const [autoReconnect, setAutoReconnect] = useState(
    connectionConfig.autoReconnect
  );

  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // HANDLERS
  const updateConnectionConfigHandler = async () => {
    try {
      const updatedData = {
        id: connectionConfig.id,
        protocol,
        host,
        port,
        tls,
        username,
        password,
        autoReconnect,
      };

      await updateConnection(updatedData);

      setConnectionConfig(updatedData);
      if (autoReconnect) {
        await connecting(updatedData);
      }

      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setShowErrorModal(true);
      console.error("handlerUpdateConnectionConfig Error: " + (error as any));
    }
  };

  // USE EFFECT
  useEffect(() => {
    if (isVisible && connectionConfig) {
      setProtocol(connectionConfig.protocol);
      setHost(connectionConfig.host);
      setPort(connectionConfig.port);
      setTls(connectionConfig.tls);
      setUsername(connectionConfig.username || "");
      setPassword(connectionConfig.password || "");
      setAutoReconnect(connectionConfig.autoReconnect);
    }
  }, [isVisible, connectionConfig]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <ThemedView
          style={[styles.fullScreenContainer, { paddingTop: insets.top }]}
        >
          <View
            style={[styles.header, { borderBottomColor: colorTheme.border }]}
          >
            <ThemedText type="title" style={styles.headerTitle}>
              Connection Config
            </ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={colorTheme.text} />
            </Pressable>
          </View>

          {/* FORM CONTENT */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* PROTOCOL */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Protocol</ThemedText>

                <View style={styles.radioGroup}>
                  {/* MQTT */}
                  <Pressable
                    style={[
                      styles.radio,
                      protocol === "mqtt" && {
                        backgroundColor: colorTheme.tint + "20",
                      },
                      { borderColor: colorTheme.border },
                    ]}
                    onPress={() => setProtocol("mqtt")}
                  >
                    <ThemedText
                      style={{
                        color:
                          protocol === "mqtt"
                            ? colorTheme.tint
                            : colorTheme.text,
                      }}
                    >
                      MQTT
                    </ThemedText>
                  </Pressable>

                  {/* MQTTs */}
                  <Pressable
                    style={[
                      styles.radio,
                      protocol === "mqtts" && {
                        backgroundColor: colorTheme.tint + "20",
                      },
                      { borderColor: colorTheme.border, marginLeft: 10 },
                    ]}
                    onPress={() => setProtocol("mqtts")}
                  >
                    <ThemedText
                      style={{
                        color:
                          protocol === "mqtts"
                            ? colorTheme.tint
                            : colorTheme.text,
                      }}
                    >
                      MQTTs
                    </ThemedText>
                  </Pressable>
                </View>
              </View>

              {/* HOST / IP */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Host</ThemedText>
                <TextInput
                  style={themedTextInputStyle}
                  value={host}
                  onChangeText={setHost}
                  placeholder="e.g., test.mosquitto.org"
                  placeholderTextColor={colorTheme.tabIconDefault}
                />
              </View>

              {/* PORT */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Port</ThemedText>
                <TextInput
                  style={themedTextInputStyle}
                  value={port.toString()}
                  onChangeText={(text: string) => {
                    const numeric = text.replaceAll(/\D/g, "");
                    setPort(numeric ? Number(numeric) : 0);
                  }}
                  placeholder="e.g., 1883"
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholderTextColor={colorTheme.tabIconDefault}
                  inputMode="numeric"
                />
              </View>

              {/* SSL (TOGGLE) */}
              <View style={styles.toggleRow}>
                <ThemedText style={styles.label}>TLS</ThemedText>
                <Switch
                  trackColor={{
                    false: colorTheme.tabIconDefault,
                    true: colorTheme.tabIconSelected,
                  }}
                  thumbColor={colorTheme.tint}
                  onValueChange={setTls}
                  value={tls}
                />
              </View>

              {/* USERNAME */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>
                  Username (Optional)
                </ThemedText>
                <TextInput
                  style={themedTextInputStyle}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="e.g., myuser"
                  placeholderTextColor={colorTheme.tabIconDefault}
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>
                  Password (Optional)
                </ThemedText>
                <TextInput
                  style={themedTextInputStyle}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor={colorTheme.tabIconDefault}
                />
              </View>

              {/* AUTO RECONNECT (TOGGLE) */}
              <View style={styles.toggleRow}>
                <ThemedText style={styles.label}>Auto Reconnect</ThemedText>
                <Switch
                  trackColor={{
                    false: colorTheme.tabIconDefault,
                    true: colorTheme.tabIconSelected,
                  }}
                  thumbColor={colorTheme.tint}
                  onValueChange={setAutoReconnect}
                  value={autoReconnect}
                />
              </View>

              {/* SAVE BUTTON */}
              <Pressable
                style={[
                  styles.saveButton,
                  { backgroundColor: colorTheme.tint },
                ]}
                onPress={updateConnectionConfigHandler}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </ThemedView>
      </Modal>

      <ErrorModal
        visible={showErrorModal}
        message={error}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
