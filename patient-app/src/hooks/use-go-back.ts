import { useRouter } from "expo-router";

export function useGoBack() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.navigate("/");
  };
}
