import { describe, expect, it } from "vitest";
import { APP_INFO, buildInfoRows } from "../src";

const value = (rows: { label: string; value: string }[], label: string) => rows.find((r) => r.label === label)?.value;

describe("F-ABOUT-03 thông tin bản đang chạy", () => {
  it("link chính thức", () => {
    expect(APP_INFO.website).toBe("https://kinhdich-app.vercel.app");
  });

  it("F-ABOUT-04 link tải app Android", () => {
    expect(APP_INFO.androidDownload).toMatch(/^https:\/\/0316888896-my\.sharepoint\.com\//);
  });

  it("mobile chạy bản gốc trong file cài", () => {
    const rows = buildInfoRows({ platform: "android", channel: "production", build: "0.3.0 (12)", profile: "apk", easBuildId: "d0d09cdf-523b-4368-86d7-fff847996353", runtime: "9a5d1c6296bb48ba9841bf6a72aa1af2ad59eb4d", update: null });
    expect(rows.map((r) => r.label)).toEqual(["Nền tảng", "Phiên bản", "Kênh cập nhật", "Mã build", "Profile build", "Mã build EAS", "Runtime", "Bản cập nhật"]);
    expect(value(rows, "Profile build")).toBe("apk — bản dùng thật (APK)");
    expect(value(rows, "Nền tảng")).toBe("Android");
    expect(value(rows, "Phiên bản")).toBe(APP_INFO.version);
    expect(value(rows, "Kênh cập nhật")).toBe("production");
    expect(value(rows, "Mã build")).toBe("0.3.0 (12)");
    expect(value(rows, "Mã build EAS")).toBe("d0d09cdf");
    expect(value(rows, "Runtime")).toBe("9a5d1c62");
    expect(value(rows, "Bản cập nhật")).toBe("Bản gốc trong file cài");
  });

  it("mobile đã nhận bản cập nhật OTA", () => {
    const rows = buildInfoRows({
      platform: "ios",
      channel: "preview",
      build: "0.3.0 (3)",
      update: { id: "0b1c2d3e-aaaa-bbbb-cccc-000000000000", createdAt: new Date("2026-10-26T09:05:00Z") },
    });
    expect(value(rows, "Bản cập nhật")).toBe("0b1c2d3e · 2026-10-26 09:05 UTC");
    expect(rows.map((r) => r.label)).not.toContain("Mã build EAS");
    expect(rows.map((r) => r.label)).not.toContain("Profile build");
  });

  it("development build / Expo Go không có kênh", () => {
    const rows = buildInfoRows({ platform: "android", channel: null, build: null, profile: "development", update: null });
    expect(value(rows, "Profile build")).toBe("development — bản phát triển, cần chạy npx expo start");
    expect(value(rows, "Kênh cập nhật")).toBe("Chưa gắn kênh (development build hoặc Expo Go)");
    expect(value(rows, "Mã build")).toBe("Không rõ");
  });

  it("web trên Vercel", () => {
    const rows = buildInfoRows({ platform: "web", channel: "production", build: "7530c3532d025a81a8d227172b080c4f1961a484" });
    expect(rows.map((r) => r.label)).toEqual(["Nền tảng", "Phiên bản", "Kênh cập nhật", "Mã build"]);
    expect(value(rows, "Nền tảng")).toBe("Web");
    expect(value(rows, "Mã build")).toBe("7530c35");
  });

  it("không sập khi module native trả về dữ liệu lạ", () => {
    const odd = { id: 12345 as unknown as string, createdAt: "hôm qua" as unknown as Date };
    expect(() => buildInfoRows({ platform: "android", channel: null, build: null, easBuildId: {} as unknown as string, update: odd })).not.toThrow();
  });

  it("web chạy local", () => {
    expect(value(buildInfoRows({ platform: "web", channel: null, build: null }), "Kênh cập nhật")).toBe("Chạy trên máy (không qua Vercel)");
  });
});
