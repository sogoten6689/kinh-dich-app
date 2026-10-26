import { describe, expect, it } from "vitest";
import { assertCastLines, buildReading, castByCoins, castByYarrow, lineLabel, readingGuide, seededRng, tossCoins } from "../src";
import type { LineValue } from "../src";

function distribution(sample: () => LineValue, n: number) {
  const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let i = 0; i < n; i++) counts[sample()]!++;
  return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / n]));
}

describe("gieo quẻ", () => {
  it("F-CAST-01 đồng xu: phân bố 1/8, 3/8, 3/8, 1/8", () => {
    const rng = seededRng(42);
    const d = distribution(() => tossCoins(rng).value, 80_000);
    expect(d["6"]).toBeCloseTo(1 / 8, 2);
    expect(d["7"]).toBeCloseTo(3 / 8, 2);
    expect(d["8"]).toBeCloseTo(3 / 8, 2);
    expect(d["9"]).toBeCloseTo(1 / 8, 2);
  });

  it("F-CAST-02 cỏ thi: phân bố 1/16, 5/16, 7/16, 3/16", () => {
    const rng = seededRng(7);
    const d = distribution(() => castByYarrow(rng)[0], 80_000);
    expect(d["6"]).toBeCloseTo(1 / 16, 2);
    expect(d["7"]).toBeCloseTo(5 / 16, 2);
    expect(d["8"]).toBeCloseTo(7 / 16, 2);
    expect(d["9"]).toBeCloseTo(3 / 16, 2);
  });

  it("F-CAST-05 cùng seed cho cùng kết quả", () => {
    expect(castByCoins(seededRng(1)).lines).toEqual(castByCoins(seededRng(1)).lines);
  });

  it("F-CAST-04 kiểm tra đầu vào", () => {
    expect(() => assertCastLines([7, 7, 7])).toThrow(RangeError);
    expect(() => assertCastLines([7, 7, 7, 7, 7, 5])).toThrow(RangeError);
    expect(() => assertCastLines([6, 7, 8, 9, 7, 8])).not.toThrow();
  });
});

describe("F-READ-02 lập quẻ", () => {
  it("không hào động → không có quẻ biến", () => {
    const r = buildReading([7, 7, 7, 7, 7, 7]);
    expect(r.primary.number).toBe(1);
    expect(r.transformed).toBeNull();
    expect(r.changingLines).toEqual([]);
    expect(r.guide.focus).toBe("primary");
  });

  it("Truân động hào sơ → biến Tỷ", () => {
    const r = buildReading([9, 8, 8, 8, 7, 8]);
    expect(r.primary.number).toBe(3);
    expect(r.transformed?.number).toBe(8);
    expect(r.changingLines).toEqual([1]);
    expect(r.nuclear.number).toBe(23);
  });

  it("sáu hào động của Càn → Khôn, đọc Dụng Cửu", () => {
    const r = buildReading([9, 9, 9, 9, 9, 9]);
    expect(r.transformed?.number).toBe(2);
    expect(r.guide.note).toContain("Dụng Cửu");
  });

  it("F-READ-05 quy tắc đọc theo số hào động", () => {
    expect(readingGuide([2, 5]).mainLine).toBe(5);
    expect(readingGuide([1, 2, 3]).focus).toBe("both");
    expect(readingGuide([1, 2, 4, 6])).toMatchObject({ focus: "transformed", lines: [3, 5], mainLine: 3 });
    expect(readingGuide([1, 2, 3, 4, 6])).toMatchObject({ lines: [5], mainLine: 5 });
  });

  it("F-READ-06 tên hào", () => {
    expect(lineLabel(1, true)).toBe("Sơ Cửu");
    expect(lineLabel(2, false)).toBe("Lục Nhị");
    expect(lineLabel(6, false)).toBe("Thượng Lục");
  });
});
