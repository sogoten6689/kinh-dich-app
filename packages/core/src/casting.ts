import { defaultRng } from "./rng";
import type { CastLines, LineValue, Rng } from "./types";

export interface CoinToss {
  /** true = mặt ngửa (tính 3), false = mặt sấp (tính 2). */
  coins: readonly [boolean, boolean, boolean];
  value: LineValue;
}

/**
 * Gieo 3 đồng xu cho một hào: ngửa = 3, sấp = 2.
 * Tổng 6 = lão âm, 7 = thiếu dương, 8 = thiếu âm, 9 = lão dương.
 * Xác suất: 6 → 1/8, 7 → 3/8, 8 → 3/8, 9 → 1/8.
 */
export function tossCoins(rng: Rng = defaultRng): CoinToss {
  const coins = [rng() < 0.5, rng() < 0.5, rng() < 0.5] as const;
  const value = coins.reduce<number>((sum, heads) => sum + (heads ? 3 : 2), 0) as LineValue;
  return { coins, value };
}

/** Gieo đủ 6 hào bằng đồng xu, từ hào sơ lên hào thượng. */
export function castByCoins(rng: Rng = defaultRng): { lines: CastLines; tosses: CoinToss[] } {
  const tosses = Array.from({ length: 6 }, () => tossCoins(rng));
  return { lines: tosses.map((t) => t.value) as unknown as CastLines, tosses };
}

/**
 * Mô phỏng xác suất phép bói cỏ thi (50 cọng):
 * 6 → 1/16, 7 → 5/16, 8 → 7/16, 9 → 3/16.
 */
export function yarrowLine(rng: Rng = defaultRng): LineValue {
  const r = Math.floor(rng() * 16);
  if (r < 1) return 6;
  if (r < 6) return 7;
  if (r < 13) return 8;
  return 9;
}

export function castByYarrow(rng: Rng = defaultRng): CastLines {
  return Array.from({ length: 6 }, () => yarrowLine(rng)) as unknown as CastLines;
}

export function isChanging(v: LineValue): boolean {
  return v === 6 || v === 9;
}

export function isYang(v: LineValue): boolean {
  return v === 7 || v === 9;
}

/** Kiểm tra dữ liệu đầu vào (ví dụ người dùng tự nhập kết quả gieo). */
export function assertCastLines(values: readonly number[]): asserts values is CastLines {
  if (values.length !== 6) throw new RangeError(`Cần đúng 6 hào, nhận ${values.length}`);
  for (const v of values) {
    if (v !== 6 && v !== 7 && v !== 8 && v !== 9) throw new RangeError(`Giá trị hào phải là 6/7/8/9, nhận: ${v}`);
  }
}

export interface LineValueInfo {
  value: LineValue;
  name: string;
  yang: boolean;
  changing: boolean;
  /** Ký hiệu truyền thống cho hào động: ○ (lão dương), × (lão âm). */
  mark: "" | "○" | "×";
  description: string;
}

const LINE_VALUE_INFO: Readonly<Record<LineValue, LineValueInfo>> = {
  6: { value: 6, name: "Lão âm", yang: false, changing: true, mark: "×", description: "Âm đã đến cực, sẽ chuyển thành dương — hào động." },
  7: { value: 7, name: "Thiếu dương", yang: true, changing: false, mark: "", description: "Dương còn non, giữ nguyên — hào tĩnh." },
  8: { value: 8, name: "Thiếu âm", yang: false, changing: false, mark: "", description: "Âm còn non, giữ nguyên — hào tĩnh." },
  9: { value: 9, name: "Lão dương", yang: true, changing: true, mark: "○", description: "Dương đã đến cực, sẽ chuyển thành âm — hào động." },
};

/** Tên và ý nghĩa của giá trị hào 6/7/8/9. */
export function describeLineValue(v: LineValue): LineValueInfo {
  return LINE_VALUE_INFO[v];
}
