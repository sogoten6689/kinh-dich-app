import type { BuildInfo } from "@kinh-dich/core";
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { Platform } from "react-native";

const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);

/** Thông tin bản mobile đang chạy: file cài (expo-application), bản cập nhật OTA (expo-updates), profile EAS nhúng lúc build. */
export function mobileBuildInfo(): BuildInfo {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const version = str(Application.nativeApplicationVersion);
  const code = str(Application.nativeBuildVersion);
  const updateId = str(Updates.updateId);
  return {
    platform: Platform.OS === "ios" ? "ios" : "android",
    channel: str(Updates.channel),
    build: version ? (code ? `${version} (${code})` : version) : null,
    profile: str(extra.easBuildProfile),
    easBuildId: str(extra.easBuildId),
    runtime: str(Updates.runtimeVersion),
    update: Updates.isEmbeddedLaunch === true || !updateId ? null : { id: updateId, createdAt: Updates.createdAt instanceof Date ? Updates.createdAt : null },
  };
}
