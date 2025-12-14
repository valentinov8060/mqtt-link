import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import { InitializationProvider } from "@/components/contexts/initialization-context";
import { MqttProvider } from "@/components/contexts/mqtt-context";
import { HapticTab } from "@/components/haptic-tab";
import { ConnectionHeader } from "@/components/headers/connection-header";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colorTheme = Colors[colorScheme];
  return (
    <MqttProvider>
      <InitializationProvider>
        <ConnectionHeader />

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colorTheme.tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              backgroundColor: colorTheme.background,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="view-dashboard-edit"
                  size={28}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="connection"
            options={{
              title: "Connection",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="connection"
                  size={28}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="publish"
            options={{
              title: "Publish",
              tabBarIcon: ({ color }) => (
                <Entypo name="publish" size={28} color={color} />
              ),
            }}
          />
        </Tabs>
      </InitializationProvider>
    </MqttProvider>
  );
}
