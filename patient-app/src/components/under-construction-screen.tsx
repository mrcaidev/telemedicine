import { useGoBack } from "@/hooks/use-go-back";
import { ArrowLeftIcon, ConstructionIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Muted } from "./ui/typography";

export function UnderConstructionScreen() {
  const goBack = useGoBack();

  return (
    <View className="grow items-center justify-center p-6">
      <Icon as={ConstructionIcon} size={112} className="mb-2" />
      <Text className="mb-3 text-2xl font-medium">Under construction</Text>
      <Muted className="mb-6 text-center">
        We are working on this part right now. Please check back later!
      </Muted>
      <Button onPress={goBack}>
        <Icon as={ArrowLeftIcon} />
        <Text>Go back</Text>
      </Button>
    </View>
  );
}
