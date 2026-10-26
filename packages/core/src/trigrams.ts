import type { Element, TrigramKey, TrigramLines } from "./types";

export interface Trigram {
  key: TrigramKey;
  /** Tên Hán Việt, ví dụ "Càn". */
  name: string;
  hanzi: string;
  symbol: string;
  /** Tượng tự nhiên dùng để ghép tên quẻ kép, ví dụ "Thiên". */
  nature: string;
  natureVi: string;
  element: Element;
  /** Số Tiên Thiên (Phục Hy) 1..8 — dùng trong Mai Hoa Dịch Số. */
  earlyHeavenNumber: number;
  /** Phương vị theo Hậu Thiên Bát Quái (Văn Vương). */
  direction: string;
  family: string;
  lines: TrigramLines;
}

export const TRIGRAMS: Readonly<Record<TrigramKey, Trigram>> = {
  qian: { key: "qian", name: "Càn", hanzi: "乾", symbol: "☰", nature: "Thiên", natureVi: "Trời", element: "kim", earlyHeavenNumber: 1, direction: "Tây Bắc", family: "Cha", lines: [1, 1, 1] },
  dui: { key: "dui", name: "Đoài", hanzi: "兌", symbol: "☱", nature: "Trạch", natureVi: "Đầm", element: "kim", earlyHeavenNumber: 2, direction: "Tây", family: "Thiếu nữ", lines: [1, 1, 0] },
  li: { key: "li", name: "Ly", hanzi: "離", symbol: "☲", nature: "Hỏa", natureVi: "Lửa", element: "hoa", earlyHeavenNumber: 3, direction: "Nam", family: "Trung nữ", lines: [1, 0, 1] },
  zhen: { key: "zhen", name: "Chấn", hanzi: "震", symbol: "☳", nature: "Lôi", natureVi: "Sấm", element: "moc", earlyHeavenNumber: 4, direction: "Đông", family: "Trưởng nam", lines: [1, 0, 0] },
  xun: { key: "xun", name: "Tốn", hanzi: "巽", symbol: "☴", nature: "Phong", natureVi: "Gió", element: "moc", earlyHeavenNumber: 5, direction: "Đông Nam", family: "Trưởng nữ", lines: [0, 1, 1] },
  kan: { key: "kan", name: "Khảm", hanzi: "坎", symbol: "☵", nature: "Thủy", natureVi: "Nước", element: "thuy", earlyHeavenNumber: 6, direction: "Bắc", family: "Trung nam", lines: [0, 1, 0] },
  gen: { key: "gen", name: "Cấn", hanzi: "艮", symbol: "☶", nature: "Sơn", natureVi: "Núi", element: "tho", earlyHeavenNumber: 7, direction: "Đông Bắc", family: "Thiếu nam", lines: [0, 0, 1] },
  kun: { key: "kun", name: "Khôn", hanzi: "坤", symbol: "☷", nature: "Địa", natureVi: "Đất", element: "tho", earlyHeavenNumber: 8, direction: "Tây Nam", family: "Mẹ", lines: [0, 0, 0] },
};

/** Thứ tự Tiên Thiên: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8. */
export const TRIGRAM_ORDER: readonly TrigramKey[] = ["qian", "dui", "li", "zhen", "xun", "kan", "gen", "kun"];

export function trigramFromLines(lines: TrigramLines): Trigram {
  for (const key of TRIGRAM_ORDER) {
    const t = TRIGRAMS[key];
    if (t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2]) return t;
  }
  throw new Error(`Không nhận diện được quẻ đơn: ${lines.join("")}`);
}

/** Số Tiên Thiên 1..8 → quẻ đơn. Số bất kỳ ≥ 1 được lấy dư cho 8 (dư 0 tính là 8). */
export function trigramFromNumber(n: number): Trigram {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`Số phải là số nguyên dương, nhận: ${n}`);
  const idx = ((n - 1) % 8 + 8) % 8;
  return TRIGRAMS[TRIGRAM_ORDER[idx]!];
}
