import { describe, expect, it } from "vitest";
import {
  GLOSSARY,
  TRIGRAMS,
  TRIGRAM_ORDER,
  buildReading,
  castByNumbers,
  describeLineValue,
  explainHexagram,
  explainReading,
  hexagramByNumber,
  linePositionInfo,
} from "../src";

describe("F-READ-10 vị trí hào", () => {
  it("đắc chính: dương ở hào lẻ, âm ở hào chẵn", () => {
    expect(linePositionInfo(1, true).correct).toBe(true);
    expect(linePositionInfo(2, false).correct).toBe(true);
    expect(linePositionInfo(2, true).correct).toBe(false);
    expect(linePositionInfo(5, true).correct).toBe(true);
    expect(linePositionInfo(6, true).correct).toBe(false);
  });

  it("đắc trung: hào 2 và hào 5", () => {
    expect([1, 2, 3, 4, 5, 6].map((p) => linePositionInfo(p as 1, true).central)).toEqual([false, true, false, false, true, false]);
  });

  it("có tên hào, vai trò và quẻ đơn chứa hào", () => {
    const info = linePositionInfo(5, true);
    expect(info.label).toBe("Cửu Ngũ");
    expect(info.role.length).toBeGreaterThan(10);
    expect(info.trigram).toBe("upper");
    expect(linePositionInfo(3, false).trigram).toBe("lower");
  });
});

describe("F-CAST-01 giải thích giá trị hào", () => {
  it.each([
    [6, "Lão âm", false, true, "×"],
    [7, "Thiếu dương", true, false, ""],
    [8, "Thiếu âm", false, false, ""],
    [9, "Lão dương", true, true, "○"],
  ] as const)("%i → %s", (v, name, yang, changing, mark) => {
    const d = describeLineValue(v);
    expect(d).toMatchObject({ name, yang, changing, mark });
    expect(d.description.length).toBeGreaterThan(10);
  });
});

describe("F-LIB-04 thông tin bát quái", () => {
  it("mỗi quẻ đơn có tính chất, con vật, bộ phận cơ thể và mô tả", () => {
    for (const k of TRIGRAM_ORDER) {
      const t = TRIGRAMS[k];
      expect(t.quality).toBeTruthy();
      expect(t.animal).toBeTruthy();
      expect(t.body).toBeTruthy();
      expect(t.description.length).toBeGreaterThan(20);
    }
    expect(TRIGRAMS.qian.animal).toBe("Ngựa");
    expect(TRIGRAMS.kun.quality).toContain("Thuận");
  });
});

describe("F-READ-09 giải thích quẻ", () => {
  it("Truân động hào sơ: đủ các phần, đúng thứ tự", () => {
    const sections = explainReading(buildReading([9, 8, 8, 8, 7, 8]));
    expect(sections.map((s) => s.key)).toEqual(["overview", "structure", "changing", "future", "nuclear", "related", "guide"]);
    const text = Object.fromEntries(sections.map((s) => [s.key, s.body]));
    expect(text.overview).toContain("Thủy Lôi Truân");
    expect(text.structure).toContain("Khảm");
    expect(text.structure).toContain("Chấn");
    expect(text.structure).toContain("Ngoại sinh nội"); // Thủy (trên) sinh Mộc (dưới)
    expect(text.changing).toContain("Sơ Cửu");
    expect(text.changing).toContain("dương chuyển thành âm");
    expect(text.future).toContain("Thủy Địa Tỷ");
    expect(text.nuclear).toContain("Sơn Địa Bác");
  });

  it("không hào động thì không có phần quẻ biến", () => {
    const sections = explainReading(buildReading([7, 8, 7, 8, 7, 8]));
    expect(sections.map((s) => s.key)).not.toContain("future");
    expect(sections.find((s) => s.key === "changing")?.body).toContain("ổn định");
  });

  it.each([
    [1, "cùng hành"], // Càn/Càn
    [11, "Ngoại sinh nội"], // Khôn (Thổ) trên, Càn (Kim) dưới → Thổ sinh Kim
    [12, "Nội sinh ngoại"], // Càn (Kim) trên, Khôn (Thổ) dưới → Thổ sinh Kim
    [63, "Ngoại khắc nội"], // Khảm (Thủy) trên, Ly (Hỏa) dưới → Thủy khắc Hỏa
    [64, "Nội khắc ngoại"], // Ly (Hỏa) trên, Khảm (Thủy) dưới → Thủy khắc Hỏa
  ] as const)("quan hệ ngũ hành nội–ngoại quẻ %i", (n, phrase) => {
    expect(explainHexagram(hexagramByNumber(n)).relation).toContain(phrase);
  });

  it("giải thích cấu trúc quẻ có thông tin từng hào", () => {
    const e = explainHexagram(hexagramByNumber(63)); // Ký Tế: mọi hào đều đắc chính
    expect(e.lines).toHaveLength(6);
    expect(e.lines.every((l) => l.correct)).toBe(true);
    expect(e.lines[0]?.label).toBe("Sơ Cửu");
  });
});

describe("F-CAST-03 Mai Hoa: các bước tính", () => {
  it("ghi lại số dư để giải thích", () => {
    const r = castByNumbers(13, 30);
    expect(r.steps).toEqual({ upperRemainder: 5, lowerRemainder: 6, movingRemainder: 1 });
    expect(r.ti.key).toBe("xun");
    expect(r.yong.key).toBe("kan");
  });

  it("dư 0 được ghi là 8 / 6", () => {
    expect(castByNumbers(8, 16).steps).toEqual({ upperRemainder: 8, lowerRemainder: 8, movingRemainder: 6 });
  });
});

describe("F-LIB-05 thuật ngữ", () => {
  it("có các thuật ngữ cốt lõi, khóa không trùng", () => {
    const keys = GLOSSARY.map((g) => g.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of ["hao", "hao-dong", "que-chu", "que-bien", "ho-quai", "the", "dung", "dac-chinh", "dac-trung"]) {
      expect(keys).toContain(k);
    }
    for (const g of GLOSSARY) expect(g.detail.length).toBeGreaterThan(20);
  });
});

describe("F-LIB-04 phương vị bát quái", () => {
  const opposite: Record<string, string> = {
    Bắc: "Nam", Nam: "Bắc", Đông: "Tây", Tây: "Đông",
    "Đông Bắc": "Tây Nam", "Tây Nam": "Đông Bắc", "Đông Nam": "Tây Bắc", "Tây Bắc": "Đông Nam",
  };

  it("Tiên Thiên: các cặp đối nhau nằm ở hai phương đối diện", () => {
    for (const [a, b] of [["qian", "kun"], ["li", "kan"], ["dui", "gen"], ["zhen", "xun"]] as const) {
      expect(opposite[TRIGRAMS[a].earlyHeavenDirection]).toBe(TRIGRAMS[b].earlyHeavenDirection);
    }
  });

  it("mỗi cách xếp dùng đủ 8 phương", () => {
    expect(new Set(TRIGRAM_ORDER.map((k) => TRIGRAMS[k].direction)).size).toBe(8);
    expect(new Set(TRIGRAM_ORDER.map((k) => TRIGRAMS[k].earlyHeavenDirection)).size).toBe(8);
    expect(TRIGRAMS.li.direction).toBe("Nam");
    expect(TRIGRAMS.qian.earlyHeavenDirection).toBe("Nam");
  });
});

describe("F-ABOUT-01 nội dung dùng chung", () => {
  it("thông tin tác giả và đủ 3 phương pháp gieo", async () => {
    const { APP_INFO, CAST_METHODS } = await import("../src");
    expect(APP_INFO.author).toBe("Lam Nguyen");
    expect(APP_INFO.organization).toBe("Egitech");
    expect(CAST_METHODS.map((m) => m.id)).toEqual(["coins", "yarrow", "numbers"]);
  });
});
