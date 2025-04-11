import { useMeQuery } from "@/api/auth";
import { LoadingScreen } from "@/components/loading-screen";
import { Redirect } from "expo-router";

export default function Entrypoint() {
  const { data, isPending } = useMeQuery();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (data) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
