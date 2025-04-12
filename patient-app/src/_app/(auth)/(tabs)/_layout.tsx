import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { CalendarIcon, HouseIcon, UserRoundIcon } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon as={HouseIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          tabBarLabel: "Appointment",
          tabBarIcon: ({ color, size }) => (
            <Icon as={CalendarIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ color, size }) => (
            <Icon as={UserRoundIcon} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
