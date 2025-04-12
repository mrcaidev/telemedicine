import { StyleSheet, View, type ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export function Skeleton({ style, children, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={StyleSheet.compose(
        {
          borderRadius: 4,
          backgroundColor: theme.colors.surfaceVariant,
        },
        style,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
