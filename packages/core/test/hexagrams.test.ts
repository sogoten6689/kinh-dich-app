import { describe, expect, it } from "vitest";
import {
  HEXAGRAMS,
  TRIGRAMS,
  TRIGRAM_ORDER,
  hexagramByNumber,
  hexagramFromLines,
  hexagramFromTrigrams,
  invertedHexagram,
  nuclearHexagram,
  oppositeHexagram,
  searchHexagrams,
  trigramFromNumber,
} from "../src";

describe("F-LIB-04 bát quái", () => {
  it("8 quẻ đơn có 8 tổ hợp hào khác nhau", () => {
    const patterns = new Set(TRIGRAM_ORDER.map((k) => TRIGRAMS[k].lines.join("")));
    expect(patterns.size).toBe(8);
  });

  it("số Tiên Thiên khớp thứ tự Càn 1 … Khôn 8", () => {
    expect(TRIGRAM_ORDER.map((k) => TRIGRAMS[k].earlyHeavenNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(trigramFromNumber(9).key).toBe("qian");
    expect(trigramFromNumber(16).key).toBe("kun");
  });
});

describe("F-LIB-01 / F-READ-01 64 quẻ", () => {
  it("đủ 64 quẻ, đánh số 1..64, không trùng tổ hợp hào", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    HEXAGRAMS.forEach((h, i) => expect(h.number).toBe(i + 1));
    expect(new Set(HEXAGRAMS.map((h) => h.lines.join(""))).size).toBe(64);
  });

  it("tra ngược từ hào ra đúng quẻ", () => {
    for (const h of HEXAGRAMS) expect(hexagramFromLines(h.lines).number).toBe(h.number);
  });

  it.each([
    [1, "qian", "qian", "Thuần Càn"],
    [2, "kun", "kun", "Thuần Khôn"],
    [3, "kan", "zhen", "Thủy Lôi Truân"],
    [11, "kun", "qian", "Địa Thiên Thái"],
    [12, "qian", "kun", "Thiên Địa Bĩ"],
    [30, "li", "li", "Thuần Ly"],
    [54, "zhen", "dui", "Lôi Trạch Quy Muội"],
    [63, "kan", "li", "Thủy Hỏa Ký Tế"],
    [64, "li", "kan", "Hỏa Thủy Vị Tế"],
  ] as const)("quẻ %i = %s trên %s dưới (%s)", (n, upper, lower, fullName) => {
    const h = hexagramByNumber(n);
    expect(h.upper.key).toBe(upper);
    expect(h.lower.key).toBe(lower);
    expect(h.fullName).toBe(fullName);
    expect(hexagramFromTrigrams(upper, lower).number).toBe(n);
  });

  it("hào xếp từ dưới lên: Truân = Chấn (100) dưới, Khảm (010) trên", () => {
    expect(hexagramByNumber(3).lines).toEqual([1, 0, 0, 0, 1, 0]);
  });

  it("báo lỗi số quẻ ngoài phạm vi", () => {
    expect(() => hexagramByNumber(0)).toThrow(RangeError);
    expect(() => hexagramByNumber(65)).toThrow(RangeError);
    expect(() => hexagramByNumber(1.5)).toThrow(RangeError);
  });
});

describe("F-READ-03 / F-READ-04 quẻ phái sinh", () => {
  it("hỗ quái", () => {
    expect(nuclearHexagram(hexagramByNumber(1)).number).toBe(1);
    expect(nuclearHexagram(hexagramByNumber(3)).number).toBe(23); // Truân → Bác
    expect(nuclearHexagram(hexagramByNumber(63)).number).toBe(64); // Ký Tế → Vị Tế
  });

  it("thác quái (đảo âm dương)", () => {
    expect(oppositeHexagram(hexagramByNumber(1)).number).toBe(2);
    expect(oppositeHexagram(hexagramByNumber(63)).number).toBe(64);
    for (const h of HEXAGRAMS) expect(oppositeHexagram(oppositeHexagram(h)).number).toBe(h.number);
  });

  it("tổng quái (lật ngược)", () => {
    expect(invertedHexagram(hexagramByNumber(3)).number).toBe(4); // Truân → Mông
    expect(invertedHexagram(hexagramByNumber(11)).number).toBe(12); // Thái → Bĩ
    expect(invertedHexagram(hexagramByNumber(1)).number).toBe(1);
  });
});

describe("F-LIB-02 tìm kiếm", () => {
  it("tìm theo số, tên có/không dấu, chữ Hán", () => {
    expect(searchHexagrams("11").map((h) => h.number)).toContain(11);
    expect(searchHexagrams("truan")[0]?.number).toBe(3);
    expect(searchHexagrams("Vị Tế")[0]?.number).toBe(64);
    expect(searchHexagrams("既濟")[0]?.number).toBe(63);
    expect(searchHexagrams("")).toHaveLength(64);
  });
});
