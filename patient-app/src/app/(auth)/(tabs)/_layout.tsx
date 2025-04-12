import { Tabs } from "expo-router";
import { Icon, useTheme } from "react-native-paper";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveBackgroundColor: theme.colors.background,
        tabBarInactiveTintColor: theme.colors.outline,
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          tabBarLabel: "Appointment",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? "calendar-blank" : "calendar-blank-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? "account" : "account-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
