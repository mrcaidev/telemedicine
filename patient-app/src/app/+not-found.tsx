import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { useGoBack } from "@/hooks/use-go-back";
import { ArrowLeftIcon } from "lucide-react-native";
import { View } from "react-native";

export default function NotFoundPage() {
  const goBack = useGoBack();

  return (
    <View className="grow items-center justify-center p-6">
      <Text className="text-[112px] font-bold">404</Text>
      <Text className="mb-3 text-2xl font-medium">Oops! Page not found</Text>
      <Muted className="mb-6 text-center">
        It seems like the page you are looking for does not exist or might have
        been removed.
      </Muted>
      <Button onPress={goBack}>
        <Icon as={ArrowLeftIcon} />
        <Text>Go back</Text>
      </Button>
    </View>
  );
}
