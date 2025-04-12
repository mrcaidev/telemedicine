import "@/global.css";
import { QueryProvider } from "@/providers/query";
import { ThemeProvider } from "@/providers/theme";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Slot />
      </QueryProvider>
    </ThemeProvider>
  );
}
