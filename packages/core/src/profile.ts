import { CYCLE_THEMES, personalCycle, type BirthDate } from "./numerology";

/** Hồ sơ người dùng, chỉ lưu trên thiết bị. */
export interface Profile {
  name: string;
  birth: BirthDate;
}

export type ParseResult = { ok: true; date: BirthDate } | { ok: false; error: string };

function isValidDate(day: number, month: number, year: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/** Đọc ngày sinh dạng ngày/tháng/năm (dấu / - . hoặc khoảng trắng). */
export function parseBirthDate(input: string, now: Date): ParseResult {
  const m = input.trim().match(/^(\d{1,2})[/\-. ](\d{1,2})[/\-. ](\d{4})$/);
  if (!m) return { ok: false, error: "Hãy nhập ngày sinh theo dạng ngày/tháng/năm, ví dụ 15/08/1990." };
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (!isValidDate(day, month, year)) return { ok: false, error: `Ngày ${m[1]}/${m[2]}/${m[3]} không có thật, bạn kiểm tra lại nhé.` };
  if (year < 1900) return { ok: false, error: "Năm sinh cần từ 1900 trở đi." };
  if (new Date(year, month - 1, day) > now) return { ok: false, error: "Ngày sinh không thể ở tương lai." };
  return { ok: true, date: { day, month, year } };
}

const CAN = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"] as const;
const CHI = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"] as const;
const ANIMAL: Readonly<Record<(typeof CHI)[number], string>> = {
  Tý: "Chuột",
  Sửu: "Trâu",
  Dần: "Hổ",
  Mão: "Mèo",
  Thìn: "Rồng",
  Tỵ: "Rắn",
  Ngọ: "Ngựa",
  Mùi: "Dê",
  Thân: "Khỉ",
  Dậu: "Gà",
  Tuất: "Chó",
  Hợi: "Lợn",
};

export interface CanChi {
  can: string;
  chi: string;
  name: string;
  animal: string;
}

/** Can chi của một năm âm lịch (tính theo năm dương lịch tương ứng). */
export function canChi(year: number): CanChi {
  const can = CAN[((year % 10) + 10) % 10]!;
  const chi = CHI[((year % 12) + 12) % 12]!;
  return { can, chi, name: `${can} ${chi}`, animal: ANIMAL[chi] };
}

export interface AgeInfo {
  /** Tuổi tròn theo dương lịch. */
  age: number;
  /** Tuổi mụ: năm hiện tại − năm sinh + 1. */
  lunarAge: number;
  canChi: CanChi;
  /** Lưu ý khi sinh vào tháng 1 hoặc đầu tháng 2 (có thể trước Tết). */
  tetNote: string | null;
}

export function ageInfo(b: BirthDate, now: Date): AgeInfo {
  const hadBirthday = now.getMonth() + 1 > b.month || (now.getMonth() + 1 === b.month && now.getDate() >= b.day);
  const mayBeBeforeTet = b.month === 1 || (b.month === 2 && b.day <= 20);
  return {
    age: now.getFullYear() - b.year - (hadBirthday ? 0 : 1),
    lunarAge: now.getFullYear() - b.year + 1,
    canChi: canChi(b.year),
    tetNote: mayBeBeforeTet
      ? `Nếu bạn sinh trước Tết Nguyên Đán năm ${b.year}, tuổi âm lịch của bạn thuộc năm ${canChi(b.year - 1).name} (con ${canChi(b.year - 1).animal}).`
      : null,
  };
}

/** Tên gọi: chữ cuối của họ tên Việt, viết hoa chữ đầu. */
export function givenName(fullName: string): string {
  const last = fullName.trim().split(/\s+/).pop() ?? "";
  return last ? last.charAt(0).toLocaleUpperCase("vi") + last.slice(1).toLocaleLowerCase("vi") : "";
}

/** "Chào buổi sáng, An" theo giờ trong ngày. */
export function greeting(fullName: string, now: Date): string {
  const h = now.getHours();
  const part = h >= 4 && h <= 10 ? "sáng" : h <= 13 && h >= 11 ? "trưa" : h >= 14 && h <= 17 ? "chiều" : "tối";
  const name = givenName(fullName);
  return name ? `Chào buổi ${part}, ${name}` : `Chào buổi ${part}`;
}

export function serializeProfile(p: Profile): string {
  return JSON.stringify({ name: p.name, birth: p.birth });
}

/** Đọc hồ sơ đã lưu; dữ liệu hỏng hoặc không hợp lệ → null. */
export function parseProfile(raw: string | null | undefined): Profile | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { name?: unknown; birth?: { day?: unknown; month?: unknown; year?: unknown } };
    const { day, month, year } = v.birth ?? {};
    if (typeof v.name !== "string" || typeof day !== "number" || typeof month !== "number" || typeof year !== "number") return null;
    if (!isValidDate(day, month, year)) return null;
    return { name: v.name, birth: { day, month, year } };
  } catch {
    return null;
  }
}

/** Lời chào và lời nhắn theo ngày cá nhân, hiện ở đầu trang Gieo quẻ. */
export function dailyMessage(p: Profile, now: Date): { greeting: string; line: string } {
  const d = personalCycle(p.birth, now).day;
  return { greeting: greeting(p.name, now), line: `Hôm nay là ngày cá nhân số ${d} của bạn — ngày của ${CYCLE_THEMES[d]}.` };
}
