import { View } from "react-native";
import { Spinner } from "./spinner";

export function LoadingScreen() {
  return (
    <View className="grow items-center justify-center">
      <Spinner size={48} />
    </View>
  );
}
