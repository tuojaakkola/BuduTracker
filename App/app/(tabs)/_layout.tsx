import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors, spacing } from "../../src/styles";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: colors.text.muted,

        tabBarStyle: {
          backgroundColor: "rgba(11, 29, 18, 0.75)",
          height: 65,
          borderTopWidth: 0,
          position: "absolute",
          left: spacing.xl * 2,
          right: spacing.xl * 2,
          bottom: spacing.xs,
          borderRadius: spacing.lg,
          paddingTop: spacing.xs,
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
          title: "Asetukset",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dataset" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
