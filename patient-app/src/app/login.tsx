import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function LogInPage() {
  return (
    <View>
      <Text>Log in page</Text>
      <Link href="/register">Register</Link>
    </View>
  );
}
