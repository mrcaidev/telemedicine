import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { CalendarIcon, HouseIcon, UserRoundIcon } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarActiveTintColor: "#009689",
        tabBarInactiveTintColor: "#71717a",
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={HouseIcon}
              size={size}
              className={focused ? "text-primary" : "text-muted-foreground"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          tabBarLabel: "Appointment",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={CalendarIcon}
              size={size}
              className={focused ? "text-primary" : "text-muted-foreground"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={UserRoundIcon}
              size={size}
              className={focused ? "text-primary" : "text-muted-foreground"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
