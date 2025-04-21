import "@/global.css";
import { QueryProvider } from "@/providers/query";
import "@/utils/datetime";
import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Slot />
      <PortalHost />
    </QueryProvider>
  );
}
