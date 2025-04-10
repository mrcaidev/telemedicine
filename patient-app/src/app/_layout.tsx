import { PaperProvider } from "@/providers/paper";
import { QueryProvider } from "@/providers/query";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </QueryProvider>
  );
}
