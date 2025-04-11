import type { PropsWithChildren } from "react";
import { MD3LightTheme, PaperProvider as Provider } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    primary: "rgb(0, 106, 97)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(115, 248, 231)",
    onPrimaryContainer: "rgb(0, 32, 28)",
    secondary: "rgb(22, 96, 165)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(211, 228, 255)",
    onSecondaryContainer: "rgb(0, 28, 56)",
    tertiary: "rgb(0, 108, 71)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(130, 249, 190)",
    onTertiaryContainer: "rgb(0, 33, 19)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(250, 253, 251)",
    onBackground: "rgb(25, 28, 27)",
    surface: "rgb(250, 253, 251)",
    onSurface: "rgb(25, 28, 27)",
    surfaceVariant: "rgb(218, 229, 226)",
    onSurfaceVariant: "rgb(63, 73, 71)",
    outline: "rgb(111, 121, 119)",
    outlineVariant: "rgb(190, 201, 198)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(45, 49, 48)",
    inverseOnSurface: "rgb(239, 241, 239)",
    inversePrimary: "rgb(82, 219, 203)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 246, 243)",
      level2: "rgb(230, 241, 239)",
      level3: "rgb(223, 237, 234)",
      level4: "rgb(220, 235, 233)",
      level5: "rgb(215, 232, 229)",
    },
    surfaceDisabled: "rgba(25, 28, 27, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 27, 0.38)",
    backdrop: "rgba(41, 50, 49, 0.4)",
  },
};

export function PaperProvider({ children }: PropsWithChildren) {
  return <Provider theme={theme}>{children}</Provider>;
}
