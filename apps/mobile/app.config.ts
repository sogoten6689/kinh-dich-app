import type { ExpoConfig } from "expo/config";

// EAS project id lấy từ biến môi trường (GitHub Actions variable / `eas init`),
// để repo không phụ thuộc tài khoản Expo cụ thể.
const projectId = process.env.EAS_PROJECT_ID;

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
