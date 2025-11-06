import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: "#000" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#808080",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.labelStyle,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name="wallet-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="send"
          options={{
            title: "Browser",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name="swap-horizontal" size={26} color={color} />
            ),
          }}
        />

       

        

        <Tabs.Screen
          name="receive"
          options={{
            title: "Rewards",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name="time-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Rewards",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name="settings-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 71,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e7e7e7",
    paddingBottom: Platform.OS === "ios" ? 10 : 6,
    paddingTop: 11,
  },
  labelStyle: {
    fontSize: 11,
    marginBottom: 3,
  },
  fabContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: -28,
  },
  fabButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#3B5BFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  fabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#000",
    fontWeight: "500",
  },
});
