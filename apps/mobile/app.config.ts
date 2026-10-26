import type { ExpoConfig } from "expo/config";

// EAS project id (tương đương `eas init --id`). Có thể ghi đè bằng biến môi trường EAS_PROJECT_ID.
const DEFAULT_EAS_PROJECT_ID = "c946102a-7cad-4886-9743-b9c29f7048cb";
const projectId = process.env.EAS_PROJECT_ID || DEFAULT_EAS_PROJECT_ID;

const config: ExpoConfig = {
  name: "Kinh Dịch",
  // Phải khớp project trên expo.dev: @sogoten6689/kinh-dich-app (id ở trên), nếu không EAS dừng build khi đọc cấu hình.
  slug: "kinh-dich-app",
  owner: process.env.EXPO_OWNER || "sogoten6689",
  version: "0.2.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/icon.png",
  splash: { image: "./assets/splash-icon.png", resizeMode: "contain", backgroundColor: "#fbf8f1" },
  ios: { supportsTablet: true, bundleIdentifier: "app.kinhdich" },
  android: {
    package: "app.kinhdich",
    adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#a3361f" },
  },
  web: { favicon: "./assets/favicon.png" },
  // Fingerprint: runtime tự đổi khi phần native đổi, nên EAS Update không bao giờ gửi JS lên bản cài không tương thích.
  runtimeVersion: { policy: "fingerprint" },
  ...(projectId ? { updates: { url: `https://u.expo.dev/${projectId}` }, extra: { eas: { projectId } } } : {}),
};

export default config;
