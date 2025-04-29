import * as SecureStore from "expo-secure-store";

function createSecureStore(key: string) {
  return {
    get: async () => {
      return await SecureStore.getItemAsync(key);
    },
    set: async (value: string) => {
      await SecureStore.setItemAsync(key, value);
    },
    remove: async () => {
      await SecureStore.deleteItemAsync(key);
    },
  };
}

export const tokenStore = createSecureStore("token");
