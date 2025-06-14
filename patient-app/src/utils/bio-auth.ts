import * as LocalAuthentication from "expo-local-authentication";

export async function bioAuth() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return true;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!isEnrolled) {
    return true;
  }

  const { success } = await LocalAuthentication.authenticateAsync();

  return success;
}
