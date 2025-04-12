import {
  DefaultTheme,
  ThemeProvider as NativeThemeProvider,
  type Theme,
} from "@react-navigation/native";
import type { PropsWithChildren } from "react";

const theme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    background: "hsl(0 0% 100%)",
    text: "hsl(240 10% 3.9%)",
    card: "hsl(0 0% 100%)",
    primary: "hsl(174.71 100% 29.0%)",
    notification: "hsl(0 84.2% 60.2%)",
    border: "hsl(240 5.9% 90%)",
  },
};

export function ThemeProvider({ children }: PropsWithChildren) {
  return <NativeThemeProvider value={theme}>{children}</NativeThemeProvider>;
}
