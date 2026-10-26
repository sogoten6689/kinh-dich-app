import { describe, expect, it } from "vitest";
import { buildReading, castByNumbers, hexagramByNumber, hexagramTopics, readTopic, TOPICS, type Topic } from "../src";

const SUBJECTS: Exclude<Topic, "general">[] = ["love", "career", "fortune"];

describe("F-TOPIC-01 chủ đề", () => {
  it("có Tổng quát, Tình duyên, Công việc, Vận mệnh", () => {
    expect(TOPICS.map((t) => t.id)).toEqual(["general", "love", "career", "fortune"]);
    expect(TOPICS.map((t) => t.name)).toEqual(["Tổng quát", "Tình duyên", "Công việc", "Vận mệnh"]);
  });

  it("đủ lời luận cho 64 quẻ × 3 chủ đề, có mức cát/bình/hung", () => {
    for (let n = 1; n <= 64; n++) {
      const t = hexagramTopics(hexagramByNumber(n));
      expect(["cat", "binh", "hung"]).toContain(t.luck);
      for (const s of SUBJECTS) expect(t[s].length, `quẻ ${n} ${s}`).toBeGreaterThan(20);
    }
  });

  it.each([
    [11, "cat"],
    [12, "hung"],
    [29, "hung"],
    [15, "cat"],
    [64, "binh"],
  ] as const)("quẻ %i có mức %s", (n, luck) => {
    expect(hexagramTopics(hexagramByNumber(n)).luck).toBe(luck);
  });

  it("lời luận khác nhau giữa các chủ đề", () => {
    const t = hexagramTopics(hexagramByNumber(31));
    expect(new Set([t.love, t.career, t.fortune]).size).toBe(3);
  });
});

describe("F-TOPIC-02 luận theo chủ đề", () => {
  it("Bĩ động cả 6 hào → Thái: xu hướng tốt lên", () => {
    const r = readTopic(buildReading([6, 6, 6, 9, 9, 9]), "love");
    expect(r.now).toBe("hung");
    expect(r.future).toBe("cat");
    expect(r.trend).toBe("up");
    expect(r.sections.map((s) => s.key)).toEqual(["now", "future", "focus", "advice"]);
    const text = Object.fromEntries(r.sections.map((s) => [s.key, s.body]));
    expect(text.now).toContain("Thiên Địa Bĩ");
    expect(text.future).toContain("Địa Thiên Thái");
    expect(text.focus).toContain("cả hai phía");
  });

  it("Thái động cả 6 hào → Bĩ: xu hướng xấu đi", () => {
    expect(readTopic(buildReading([9, 9, 9, 6, 6, 6]), "career").trend).toBe("down");
  });

  it("không hào động: tình thế đứng yên, không có phần chiều hướng", () => {
    const r = readTopic(buildReading([7, 7, 7, 7, 7, 7]), "fortune");
    expect(r.trend).toBe("still");
    expect(r.future).toBeNull();
    expect(r.sections.map((s) => s.key)).toEqual(["now", "focus", "advice"]);
  });

  it("hào động ở nội quái: thay đổi bắt đầu từ phía bạn (tình duyên)", () => {
    const r = readTopic(buildReading([9, 8, 8, 8, 7, 8]), "love");
    expect(r.sections.find((s) => s.key === "focus")?.body).toContain("từ phía bạn");
  });

  it("hào động ở ngoại quái: thay đổi đến từ cấp trên, đối tác (công việc)", () => {
    const r = readTopic(buildReading([7, 8, 7, 8, 9, 8]), "career");
    expect(r.sections.find((s) => s.key === "focus")?.body).toContain("cấp trên");
  });

  it("Mai Hoa: thêm phần Thể – Dụng theo chủ đề", () => {
    const m = castByNumbers(5, 3);
    const r = readTopic(m.reading, "love", m);
    expect(r.sections.map((s) => s.key)).toContain("tiyong");
    const tiyong = r.sections.find((s) => s.key === "tiyong")!.body;
    expect(tiyong).toContain("người ấy");
    expect(tiyong).toContain("Thể sinh Dụng");
  });

  it("tiêu đề theo chủ đề", () => {
    expect(readTopic(buildReading([7, 7, 7, 7, 7, 7]), "career").title).toBe("Công việc");
  });
});
