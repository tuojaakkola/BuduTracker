import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Yhteenveto",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          headerShown: false,
          title: "Raportit",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="assessment" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Kaavat",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dataset" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
