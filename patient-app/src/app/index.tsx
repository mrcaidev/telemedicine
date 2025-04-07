import { View } from "react-native";
import { Button } from "react-native-paper";

export default function HomePage() {
  return (
    <View>
      <Button
        mode="contained"
        icon="check"
        onPress={() => console.log("Hello world")}
      >
        Press me
      </Button>
    </View>
  );
}
