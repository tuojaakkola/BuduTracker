import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#39ff88",
        tabBarInactiveTintColor: "#8b9aa7",

        tabBarStyle: {
          backgroundColor: "#0b1d12",
          height: 70,
          borderTopWidth: 0,
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 5,
          borderRadius: 20,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Yhteenveto",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Raportit",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="assessment" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Kaavat",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dataset" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
