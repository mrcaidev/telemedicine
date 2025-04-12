import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundPage() {
  const router = useRouter();

  const goHome = () => {
    router.navigate("/");
  };

  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 112, fontWeight: "bold" }}>404</Text>
      <Text style={{ marginBottom: 16, fontSize: 20, fontWeight: "medium" }}>
        Oops! Page not found
      </Text>
      <Text style={{ marginBottom: 24, textAlign: "center" }}>
        It seems like the page you are looking for does not exist or might have
        been removed.
      </Text>
      <Button onPress={goHome}>Take me home</Button>
    </View>
  );
}
