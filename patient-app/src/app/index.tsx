import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function HomePage() {
  return (
    <View>
      <Text>Home page</Text>
      <Link href="/register">Register</Link>
    </View>
  );
}
