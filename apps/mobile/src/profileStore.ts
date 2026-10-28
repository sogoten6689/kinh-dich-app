import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseProfile, serializeProfile, type Profile } from "@kinh-dich/core";

const KEY = "kinhdich.profile";

/** Hồ sơ lưu trong AsyncStorage của máy; lỗi đọc/ghi thì coi như chưa có (cùng khóa với web). */
export async function loadProfile(): Promise<Profile | null> {
  try {
    return parseProfile(await AsyncStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export async function saveProfile(p: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, serializeProfile(p));
  } catch {
    // Không lưu được thì vẫn dùng trong phiên hiện tại.
  }
}

export async function clearProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // bỏ qua
  }
}
