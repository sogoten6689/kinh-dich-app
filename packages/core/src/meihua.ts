import { elementRelation, ELEMENT_NAMES } from "./elements";
import { hexagramFromTrigrams } from "./hexagrams";
import { buildReading, type Reading } from "./reading";
import { trigramFromNumber, type Trigram } from "./trigrams";
import type { CastLines, LinePosition, LineValue } from "./types";

export interface MeihuaResult {
  reading: Reading;
  movingLine: LinePosition;
  /** Quẻ Thể: quẻ đơn không chứa hào động — đại diện cho người hỏi. */
  ti: Trigram;
  /** Quẻ Dụng: quẻ đơn chứa hào động — đại diện cho sự việc. */
  yong: Trigram;
  verdict: TiYongVerdict;
}

export interface TiYongVerdict {
  outcome: "cat" | "tieu-cat" | "hung" | "hao";
  label: string;
  explanation: string;
}

/**
 * Mai Hoa Dịch Số — lập quẻ bằng hai số (ví dụ số người hỏi đưa ra).
 * Thượng quái = a mod 8, hạ quái = b mod 8 (dư 0 → 8, theo số Tiên Thiên),
 * hào động = (a + b) mod 6 (dư 0 → 6).
 */
export function castByNumbers(a: number, b: number): MeihuaResult {
  for (const n of [a, b]) {
    if (!Number.isInteger(n) || n < 1) throw new RangeError(`Số phải là số nguyên dương, nhận: ${n}`);
  }
  const upper = trigramFromNumber(a);
  const lower = trigramFromNumber(b);
  const movingLine = ((((a + b) % 6) || 6) as LinePosition);
  return fromTrigrams(upper, lower, movingLine);
}

export function fromTrigrams(upper: Trigram, lower: Trigram, movingLine: LinePosition): MeihuaResult {
  const primary = hexagramFromTrigrams(upper.key, lower.key);
  const cast = primary.lines.map((bit, i): LineValue => {
    const moving = i + 1 === movingLine;
    if (bit === 1) return moving ? 9 : 7;
    return moving ? 6 : 8;
  }) as unknown as CastLines;
  const reading = buildReading(cast);
  const yong = movingLine <= 3 ? lower : upper;
  const ti = movingLine <= 3 ? upper : lower;
  return { reading, movingLine, ti, yong, verdict: judgeTiYong(ti, yong) };
}

/** Luận sinh khắc Thể – Dụng theo ngũ hành. */
export function judgeTiYong(ti: Trigram, yong: Trigram): TiYongVerdict {
  const t = ELEMENT_NAMES[ti.element];
  const y = ELEMENT_NAMES[yong.element];
  switch (elementRelation(ti.element, yong.element)) {
    case "same":
      return { outcome: "cat", label: "Tỷ hòa — Cát", explanation: `Thể và Dụng cùng hành ${t}: mọi việc thuận hòa.` };
    case "b-generates-a":
      return { outcome: "cat", label: "Dụng sinh Thể — Đại cát", explanation: `Dụng (${y}) sinh Thể (${t}): có lợi, được giúp đỡ.` };
    case "a-overcomes-b":
      return { outcome: "tieu-cat", label: "Thể khắc Dụng — Tiểu cát", explanation: `Thể (${t}) khắc Dụng (${y}): việc thành nhưng phải tốn sức.` };
    case "a-generates-b":
      return { outcome: "hao", label: "Thể sinh Dụng — Hao tổn", explanation: `Thể (${t}) sinh Dụng (${y}): hao tốn công sức, tiền của.` };
    case "b-overcomes-a":
      return { outcome: "hung", label: "Dụng khắc Thể — Hung", explanation: `Dụng (${y}) khắc Thể (${t}): bất lợi, nên thận trọng.` };
  }
}
