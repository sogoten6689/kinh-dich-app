import { describe, expect, it } from "vitest";
import { castByNumbers, elementRelation, judgeTiYong, TRIGRAMS } from "../src";

describe("F-CAST-03 / F-READ-07 Mai Hoa Dịch Số", () => {
  it("5 và 3 → Phong Hỏa Gia Nhân, động hào 2, biến Tiểu Súc", () => {
    const r = castByNumbers(5, 3);
    expect(r.reading.primary.number).toBe(37);
    expect(r.movingLine).toBe(2);
    expect(r.reading.transformed?.number).toBe(9);
    expect(r.yong.key).toBe("li");
    expect(r.ti.key).toBe("xun");
    expect(r.verdict.outcome).toBe("hao"); // Thể Mộc sinh Dụng Hỏa
  });

  it("số chia hết lấy 8 / 6", () => {
    const r = castByNumbers(8, 16);
    expect(r.reading.primary.number).toBe(2);
    expect(r.movingLine).toBe(6);
    expect(r.yong.key).toBe("kun");
  });

  it("từ chối số không hợp lệ", () => {
    expect(() => castByNumbers(0, 3)).toThrow(RangeError);
    expect(() => castByNumbers(2.5, 3)).toThrow(RangeError);
  });

  it("ngũ hành sinh khắc", () => {
    expect(elementRelation("moc", "hoa")).toBe("a-generates-b");
    expect(elementRelation("kim", "moc")).toBe("a-overcomes-b");
    expect(elementRelation("thuy", "kim")).toBe("b-generates-a");
    expect(judgeTiYong(TRIGRAMS.qian, TRIGRAMS.li).outcome).toBe("hung"); // Hỏa khắc Kim
    expect(judgeTiYong(TRIGRAMS.qian, TRIGRAMS.dui).outcome).toBe("cat");
  });
});
