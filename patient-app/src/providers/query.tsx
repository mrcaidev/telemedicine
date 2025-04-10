import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { Alert } from "react-native";

const client = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        Alert.alert("Error", error.message, [{ text: "OK" }]);
      },
    },
  },
});

export function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
