import { APP_INFO } from "./content";

/** Thông tin bản đang chạy; app đọc từ môi trường (Vercel / expo-updates) rồi đưa vào đây để hiển thị giống nhau. */
export interface BuildInfo {
  platform: "web" | "android" | "ios";
  /** Web: VERCEL_ENV (production/preview). Mobile: kênh EAS Update. null nếu không có. */
  channel: string | null;
  /** Web: commit đã deploy. Mobile: "phiên bản (versionCode/buildNumber)" của file cài. */
  build: string | null;
  /** Mobile: profile trong eas.json đã dùng để build (EAS_BUILD_PROFILE), nếu được nhúng lúc build. */
  profile?: string | null;
  /** Mobile: id bản build trên EAS, nếu được nhúng lúc build. */
  easBuildId?: string | null;
  /** Mobile: runtimeVersion (fingerprint). */
  runtime?: string | null;
  /** Mobile: null = đang chạy bản gốc trong file cài; có giá trị = đang chạy bản cập nhật OTA. */
  update?: { id: string; createdAt: Date | null } | null;
}

export interface BuildInfoRow {
  label: string;
  value: string;
}

const PLATFORM_NAME: Readonly<Record<BuildInfo["platform"], string>> = { web: "Web", android: "Android", ios: "iOS" };

/** Ý nghĩa các profile trong apps/mobile/eas.json. */
export const BUILD_PROFILES: Readonly<Record<string, string>> = {
  development: "bản phát triển, cần chạy npx expo start",
  preview: "bản cài thử (APK)",
  apk: "bản dùng thật (APK)",
  production: "bản nộp store",
};

// Dữ liệu đến từ module native có thể sai kiểu (ví dụ trên web); ép về chuỗi để trang không sập.
function shortId(id: unknown, length = 8): string {
  return String(id).replace(/-/g, "").slice(0, length);
}

function formatUtc(d: Date): string {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`;
}

/** Các dòng hiển thị trong mục "Thông tin bản đang chạy" ở trang Giới thiệu. */
export function buildInfoRows(info: BuildInfo): BuildInfoRow[] {
  const web = info.platform === "web";
  const rows: BuildInfoRow[] = [
    { label: "Nền tảng", value: PLATFORM_NAME[info.platform] },
    { label: "Phiên bản", value: APP_INFO.version },
    {
      label: "Kênh cập nhật",
      value: info.channel ?? (web ? "Chạy trên máy (không qua Vercel)" : "Chưa gắn kênh (development build hoặc Expo Go)"),
    },
    { label: "Mã build", value: info.build ? (web ? info.build.slice(0, 7) : info.build) : "Không rõ" },
  ];
  if (web) return rows;
  if (info.profile) {
    const meaning = BUILD_PROFILES[info.profile];
    rows.push({ label: "Profile build", value: meaning ? `${info.profile} — ${meaning}` : info.profile });
  }
  if (typeof info.easBuildId === "string" && info.easBuildId) rows.push({ label: "Mã build EAS", value: shortId(info.easBuildId) });
  if (typeof info.runtime === "string" && info.runtime) rows.push({ label: "Runtime", value: info.runtime.slice(0, 8) });
  rows.push({
    label: "Bản cập nhật",
    value: info.update ? [shortId(info.update.id), info.update.createdAt && formatUtc(info.update.createdAt)].filter(Boolean).join(" · ") : "Bản gốc trong file cài",
  });
  return rows;
}
