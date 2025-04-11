import { useMeQuery } from "@/api/auth";
import { LoadingScreen } from "@/components/loading-screen";
import { Redirect, Slot } from "expo-router";

export default function AuthGuard() {
  const { data, isPending } = useMeQuery();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (data) {
    return <Slot />;
  }

  return <Redirect href="/login" />;
}
