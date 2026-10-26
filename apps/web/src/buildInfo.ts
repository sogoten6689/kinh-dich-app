import type { BuildInfo } from "@kinh-dich/core";

declare const __VERCEL_ENV__: string;
declare const __VERCEL_COMMIT__: string;

/** Thông tin bản web đang chạy, nhúng lúc build (xem vite.config.ts). */
export function webBuildInfo(): BuildInfo {
  return { platform: "web", channel: __VERCEL_ENV__ || null, build: __VERCEL_COMMIT__ || null };
}
