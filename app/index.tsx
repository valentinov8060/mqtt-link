import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useInitialWidgets } from "@/components/contexts/initialization-context";
import { useMqtt } from "@/components/contexts/mqtt-context";
import { AddWidgetModal } from "@/components/modals/add-widget-modal";
import { ErrorModal } from "@/components/modals/error-modal";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { WidgetModel } from "@/src/database/models/widget-model";
import {
  addWidget,
  deleteWidget,
  getWidgets,
} from "@/src/database/repositories/widget-repository";

export default function DashboardScreen() {
  // COLOR THEME
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  // WIDGET STATES
  const widgets: WidgetModel[] = useInitialWidgets();
  const [widgetList, setWidgetList] = useState<WidgetModel[]>(widgets);

  // MQTT CONTEXT
  const { subscribe, unsubscribe, messages, isConnected } = useMqtt();

  // MODAL STATES
  const [modalAddWidgetVisible, setModalAddWidgetVisible] = useState(false);
  const [newNameWidget, setNewNameWidget] = useState("");
  const [newTopicWidget, setNewTopicWidget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // HANDLERS
  const addWidgetHandler = async () => {
    try {
      if (!newNameWidget || !newTopicWidget) {
        throw new Error("Widget name and topic are required.");
      }

      if (widgetList.length >= 5) {
        throw new Error("Maximum 5 widgets allowed.");
      }

      await addWidget({ name: newNameWidget, topic: newTopicWidget });

      const newWidgetList = await getWidgets();
      setWidgetList(newWidgetList);

      setNewNameWidget("");
      setNewTopicWidget("");
      setModalAddWidgetVisible(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setShowErrorModal(true);
      console.error("addWidgetHandler Error: " + (error as any));
    }
  };

  const removeWidgetHandler = async (id?: number) => {
    try {
      if (id !== undefined) {
        await deleteWidget(id);
        unsubscribe(widgetList.find((w) => w.id === id)?.topic || "");
        const newWidgetList = await getWidgets();
        setWidgetList(newWidgetList);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setShowErrorModal(true);
      console.error("removeWidgetHandler Error: " + (error as any));
    }
  };

  // USE EFFECT
  useEffect(() => {
    setWidgetList(widgets);
  }, [widgets]);

  useEffect(() => {
    if (!isConnected) return;

    widgetList.forEach((w) => {
      subscribe(w.topic).catch(console.error);
    });

    return () => {
      widgetList.forEach((w) => {
        unsubscribe(w.topic).catch(console.error);
      });
    };
  }, [isConnected, widgetList]);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colorTheme.background }]}
    >
      {/* WIDGET LIST */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.widgetListContainer}>
          {widgetList?.map((w) => {
            const widgetStyles = {
              backgroundColor: colorTheme.card,
              borderColor: colorTheme.border,
            };

            const message = messages[w.topic];
            const hasMessage = message !== undefined;

            return (
              <View key={w.id} style={[styles.widgetBox, widgetStyles]}>
                <View style={styles.widgetHeader}>
                  <Text style={[styles.widgetName, { color: colorTheme.text }]}>
                    {w.name}
                  </Text>

                  <TouchableOpacity onPress={() => removeWidgetHandler(w.id)}>
                    <FontAwesome
                      name="remove"
                      size={16}
                      color={colorTheme.danger}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.widgetTopic, { color: colorTheme.icon }]}>
                  Topic: {w.topic}
                </Text>

                <Text
                  style={[
                    styles.widgetSubPayload,
                    hasMessage
                      ? styles.widgetSubPayloadActive
                      : styles.widgetSubPayloadIdle,
                    {
                      backgroundColor: hasMessage
                        ? colorTheme.background
                        : colorTheme.card,
                      color: hasMessage ? colorTheme.text : colorTheme.icon,
                    },
                  ]}
                >
                  {hasMessage ? message : "Waiting data..."}
                </Text>
              </View>
            );
          })}

          {/* ADD WIDGET BUTTON — hidden when full */}
          {widgetList.length < 5 && (
            <TouchableOpacity
              style={[
                styles.addWidgetButton,
                {
                  borderColor: colorTheme.border,
                  backgroundColor: colorTheme.card,
                },
              ]}
              onPress={() => setModalAddWidgetVisible(true)}
            >
              <Text style={{ color: colorTheme.text, fontWeight: "600" }}>
                + Add Widget
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* MODALS */}
      <AddWidgetModal
        visible={modalAddWidgetVisible}
        name={newNameWidget}
        topic={newTopicWidget}
        onChangeName={setNewNameWidget}
        onChangeTopic={setNewTopicWidget}
        onSubmit={addWidgetHandler}
        onCancel={() => setModalAddWidgetVisible(false)}
      />

      <ErrorModal
        visible={showErrorModal}
        message={error}
        onClose={() => setShowErrorModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 20 },

  /* Widget List */
  widgetListContainer: {
    marginTop: 20,
    width: "100%",
    gap: 14,
  },
  widgetBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  widgetHeader: { flexDirection: "row", justifyContent: "space-between" },
  widgetName: { fontSize: 16, fontWeight: "600" },
  widgetTopic: { marginTop: 4, fontSize: 14, opacity: 0.7 },
  widgetSubPayload: {
    padding: 3,
    fontSize: 18,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 2,
  },
  widgetSubPayloadIdle: {
    fontStyle: "italic",
    opacity: 0.6,
  },
  widgetSubPayloadActive: {
    fontWeight: "600",
  },

  /* Add Widget Button */
  addWidgetButton: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderColor: "#888",
  },
});
