import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { BottomNavigation, Icon } from "react-native-paper";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
      tabBar={({ descriptors, insets, navigation, state }) => (
        <BottomNavigation.Bar
          navigationState={state}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) {
              preventDefault();
              return;
            }
            // @ts-ignore
            navigation.dispatch({
              ...CommonActions.navigate(route.name, route.params),
              target: state.key,
            });
          }}
          safeAreaInsets={insets}
          getLabelText={({ route }) => {
            return descriptors[route.key]?.options.tabBarLabel as string;
          }}
          renderIcon={({ route, focused, color }) => {
            return descriptors[route.key]?.options.tabBarIcon?.({
              focused,
              color,
              size: 24,
            });
          }}
        />
      )}
    >
      <Tabs.Screen
        name="home"
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
