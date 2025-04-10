import * as SecureStore from "expo-secure-store";

function createSecureStore(name: string) {
  return {
    async getItem() {
      return await SecureStore.getItemAsync(name);
    },
    async setItem(value: string) {
      await SecureStore.setItemAsync(name, value);
    },
    async removeItem() {
      await SecureStore.deleteItemAsync(name);
    },
  };
}

export const tokenStore = createSecureStore("token");
