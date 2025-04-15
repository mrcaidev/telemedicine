import "@/global.css";
import { QueryProvider } from "@/providers/query";
import { ThemeProvider } from "@/providers/theme";
import "@/utils/datetime";
import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Slot />
        <PortalHost />
      </QueryProvider>
    </ThemeProvider>
  );
}
