import * as SecureStore from "expo-secure-store";

function createSecureStore(name: string) {
  return {
    async get() {
      return await SecureStore.getItemAsync(name);
    },
    async set(value: string) {
      await SecureStore.setItemAsync(name, value);
    },
    async remove() {
      await SecureStore.deleteItemAsync(name);
    },
  };
}

export const tokenStore = createSecureStore("token");
