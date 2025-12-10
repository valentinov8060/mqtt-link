import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWidgets } from "@/components/contexts/initialization-context";
import { ConnectionHeader } from "@/components/headers/connection-header";
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
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];

  const isConnected = false;

  const widgets: WidgetModel[] = useWidgets();
  const [widgetList, setWidgetList] = useState<WidgetModel[]>(widgets);

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
      console.error("addWidgetHandler Error:", error);
    }
  };

  const removeWidgetHandler = async (id?: number) => {
    try {
      if (id !== undefined) {
        await deleteWidget(id);
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

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colorTheme.background },
      ]}
    >
      <ConnectionHeader isConnected={isConnected} />

      {/* WIDGET LIST */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginTop: 12, gap: 16 }}>
          {widgetList?.map((w) => {
            const widgetStyles = {
              backgroundColor: colorTheme.card,
              borderColor: colorTheme.border,
            };

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
                    {
                      backgroundColor: colorTheme.background,
                      color: colorTheme.text,
                    },
                  ]}
                >
                  {
                    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
                  }
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
