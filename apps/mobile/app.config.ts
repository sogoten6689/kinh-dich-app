import type { ExpoConfig } from "expo/config";

// EAS project id (tương đương `eas init --id`). Có thể ghi đè bằng biến môi trường EAS_PROJECT_ID.
const DEFAULT_EAS_PROJECT_ID = "c946102a-7cad-4886-9743-b9c29f7048cb";
const projectId = process.env.EAS_PROJECT_ID || DEFAULT_EAS_PROJECT_ID;

const config: ExpoConfig = {
  name: "Kinh Dịch",
  slug: "kinh-dich",
  ...(process.env.EXPO_OWNER ? { owner: process.env.EXPO_OWNER } : {}),
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  ios: { supportsTablet: true, bundleIdentifier: "app.kinhdich" },
  android: { package: "app.kinhdich" },
  runtimeVersion: { policy: "appVersion" },
  ...(projectId ? { updates: { url: `https://u.expo.dev/${projectId}` }, extra: { eas: { projectId } } } : {}),
};

export default config;
