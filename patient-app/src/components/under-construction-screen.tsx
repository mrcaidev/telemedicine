import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

export function UnderConstructionScreen() {
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Icon source="sign-caution" size={112} />
      <Text
        style={{
          marginTop: 8,
          marginBottom: 16,
          fontSize: 20,
          fontWeight: "medium",
        }}
      >
        Under construction
      </Text>
      <Text style={{ marginBottom: 24, textAlign: "center" }}>
        We are working on this page right now. Please check back later!
      </Text>
    </View>
  );
}
