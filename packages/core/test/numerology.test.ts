import { describe, expect, it } from "vitest";
import {
  ageInfo,
  birthChart,
  canChi,
  givenName,
  greeting,
  letterValue,
  nameNumbers,
  NUMBER_MEANINGS,
  numerologyReport,
  parseBirthDate,
  parseProfile,
  personalCycle,
  reduceNumber,
  serializeProfile,
} from "../src";

describe("F-NUM-01 rút gọn số", () => {
  it("cộng chữ số đến khi còn 1 chữ số, giữ số bậc thầy 11, 22, 33", () => {
    expect(reduceNumber(48)).toBe(3);
    expect(reduceNumber(29)).toBe(11);
    expect(reduceNumber(22)).toBe(22);
    expect(reduceNumber(33)).toBe(33);
    expect(reduceNumber(38)).toBe(11);
    expect(reduceNumber(99)).toBe(9);
    expect(reduceNumber(22, false)).toBe(4);
  });

  it("bảng chữ cái Pythagoras, bỏ dấu tiếng Việt", () => {
    expect(letterValue("A")).toBe(1);
    expect(letterValue("i")).toBe(9);
    expect(letterValue("J")).toBe(1);
    expect(letterValue("Z")).toBe(8);
    expect(letterValue("Đ")).toBe(4);
    expect(letterValue("ễ")).toBe(5);
    expect(letterValue("-")).toBe(0);
  });
});

describe("F-NUM-02 các con số từ họ tên", () => {
  it("Nguyễn Văn An: sứ mệnh 3, linh hồn 8, nhân cách 4", () => {
    expect(nameNumbers("Nguyễn Văn An")).toEqual({ expression: 3, soul: 8, personality: 4 });
  });

  it("không phân biệt hoa thường, khoảng trắng thừa", () => {
    expect(nameNumbers("  nguyễn   VĂN an ")).toEqual(nameNumbers("Nguyễn Văn An"));
  });
});

describe("F-NUM-03 các con số từ ngày sinh", () => {
  it("số chủ đạo = tổng mọi chữ số ngày sinh", () => {
    expect(numerologyReport("Nguyễn Văn An", { day: 15, month: 8, year: 1990 }, new Date(2026, 9, 28)).lifePath).toBe(33);
    expect(numerologyReport("A", { day: 29, month: 11, year: 1985 }, new Date(2026, 9, 28)).lifePath).toBe(9);
    expect(numerologyReport("A", { day: 1, month: 1, year: 2000 }, new Date(2026, 9, 28)).lifePath).toBe(4);
  });

  it("số ngày sinh, năm/tháng/ngày cá nhân", () => {
    const r = numerologyReport("Nguyễn Văn An", { day: 15, month: 8, year: 1990 }, new Date(2026, 9, 28));
    expect(r.birthDay).toBe(6);
    expect(personalCycle({ day: 15, month: 8, year: 1990 }, new Date(2026, 9, 28))).toEqual({ year: 6, month: 7, day: 8 });
    expect(r.cycle).toEqual({ year: 6, month: 7, day: 8 });
  });

  it("biểu đồ ngày sinh và mũi tên", () => {
    const c = birthChart({ day: 15, month: 8, year: 1990 });
    expect(c.counts).toEqual({ 1: 2, 2: 0, 3: 0, 4: 0, 5: 1, 6: 0, 7: 0, 8: 1, 9: 2 });
    expect(c.arrows.map((a) => a.key)).toEqual(["1-5-9"]);
    expect(c.emptyArrows).toEqual([]);
    const e = birthChart({ day: 2, month: 2, year: 2002 });
    expect(e.emptyArrows.map((a) => a.key)).toEqual(expect.arrayContaining(["3-6-9", "4-5-6", "7-8-9", "1-5-9", "3-5-7"]));
    expect(e.arrows).toEqual([]);
  });

  it("có ý nghĩa cho 1–9 và 11, 22, 33", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) {
      const m = NUMBER_MEANINGS[n];
      expect(m, `số ${n}`).toBeDefined();
      for (const field of [m!.title, m!.summary, m!.strengths, m!.challenges, m!.career, m!.love]) expect(field.length).toBeGreaterThan(10);
    }
  });
});

describe("F-PROFILE-01 ngày sinh, tuổi, can chi", () => {
  it("đọc ngày sinh dd/mm/yyyy, báo lỗi rõ ràng", () => {
    expect(parseBirthDate("15/08/1990", new Date(2026, 9, 28))).toEqual({ ok: true, date: { day: 15, month: 8, year: 1990 } });
    expect(parseBirthDate("1-1-2000", new Date(2026, 9, 28))).toEqual({ ok: true, date: { day: 1, month: 1, year: 2000 } });
    expect(parseBirthDate("31/02/1990", new Date(2026, 9, 28))).toMatchObject({ ok: false });
    expect(parseBirthDate("01/01/2030", new Date(2026, 9, 28))).toMatchObject({ ok: false, error: expect.stringContaining("tương lai") });
    expect(parseBirthDate("abc", new Date(2026, 9, 28))).toMatchObject({ ok: false, error: expect.stringContaining("ngày/tháng/năm") });
  });

  it("can chi và con giáp", () => {
    expect(canChi(1990)).toMatchObject({ name: "Canh Ngọ", animal: "Ngựa" });
    expect(canChi(2024)).toMatchObject({ name: "Giáp Thìn", animal: "Rồng" });
    expect(canChi(1987)).toMatchObject({ name: "Đinh Mão", animal: "Mèo" });
    expect(canChi(2000)).toMatchObject({ name: "Canh Thìn" });
  });

  it("tuổi, tuổi mụ, lưu ý sinh trước Tết", () => {
    const a = ageInfo({ day: 15, month: 8, year: 1990 }, new Date(2026, 9, 28));
    expect(a).toMatchObject({ age: 36, lunarAge: 37, canChi: { name: "Canh Ngọ" }, tetNote: null });
    expect(ageInfo({ day: 30, month: 10, year: 1990 }, new Date(2026, 9, 28)).age).toBe(35);
    const early = ageInfo({ day: 20, month: 1, year: 1990 }, new Date(2026, 9, 28));
    expect(early.tetNote).toContain("Kỷ Tỵ");
  });
});

describe("F-PROFILE-02 hồ sơ và lời chào", () => {
  it("tên gọi là chữ cuối của họ tên", () => {
    expect(givenName("Nguyễn Văn An")).toBe("An");
    expect(givenName("  trần thị  lan ")).toBe("Lan");
    expect(givenName("")).toBe("");
  });

  it("lời chào theo buổi trong ngày", () => {
    expect(greeting("Nguyễn Văn An", new Date(2026, 9, 28, 7))).toBe("Chào buổi sáng, An");
    expect(greeting("Nguyễn Văn An", new Date(2026, 9, 28, 12))).toBe("Chào buổi trưa, An");
    expect(greeting("Nguyễn Văn An", new Date(2026, 9, 28, 16))).toBe("Chào buổi chiều, An");
    expect(greeting("Nguyễn Văn An", new Date(2026, 9, 28, 21))).toBe("Chào buổi tối, An");
    expect(greeting("", new Date(2026, 9, 28, 21))).toBe("Chào buổi tối");
  });

  it("lưu và đọc lại hồ sơ, bỏ qua dữ liệu hỏng", () => {
    const p = { name: "Nguyễn Văn An", birth: { day: 15, month: 8, year: 1990 } };
    expect(parseProfile(serializeProfile(p))).toEqual(p);
    expect(parseProfile("không phải json")).toBeNull();
    expect(parseProfile(JSON.stringify({ name: "A", birth: { day: 40, month: 1, year: 1990 } }))).toBeNull();
    expect(parseProfile(null)).toBeNull();
  });
});

describe("F-PROFILE-03 lời nhắn trong ngày", () => {
  it("gọi tên và nói ngày cá nhân", async () => {
    const { dailyMessage } = await import("../src");
    const m = dailyMessage({ name: "Nguyễn Văn An", birth: { day: 15, month: 8, year: 1990 } }, new Date(2026, 9, 28, 8));
    expect(m.greeting).toBe("Chào buổi sáng, An");
    expect(m.line).toBe("Hôm nay là ngày cá nhân số 8 của bạn — ngày của thành quả, tài chính, khẳng định bản thân.");
  });
});
