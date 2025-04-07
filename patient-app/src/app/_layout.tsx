import { PaperProvider } from "@/providers/paper";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}
