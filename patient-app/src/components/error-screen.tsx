import { useGoBack } from "@/hooks/use-go-back";
import { ArrowLeftIcon, CircleXIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Muted } from "./ui/typography";

export function ErrorScreen({ message }: { message: string }) {
  const goBack = useGoBack();

  return (
    <View className="grow items-center justify-center p-6">
      <Icon as={CircleXIcon} size={112} className="mb-2" />
      <Text className="mb-3 text-2xl font-medium">Error Occurred</Text>
      <Muted className="mb-6 text-center">{message}</Muted>
      <Button onPress={goBack}>
        <Icon as={ArrowLeftIcon} />
        <Text>Go back</Text>
      </Button>
    </View>
  );
}
