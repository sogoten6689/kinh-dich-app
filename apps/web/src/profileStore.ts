import { parseProfile, serializeProfile, type Profile } from "@kinh-dich/core";

const KEY = "kinhdich.profile";

/** Hồ sơ lưu trong localStorage của trình duyệt này; lỗi truy cập (chế độ riêng tư…) thì coi như chưa có. */
export function loadProfile(): Profile | null {
  try {
    return parseProfile(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEY, serializeProfile(p));
  } catch {
    // Không lưu được thì vẫn dùng trong phiên hiện tại.
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // bỏ qua
  }
}
