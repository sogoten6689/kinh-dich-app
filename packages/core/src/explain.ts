import { describeLineValue } from "./casting";
import { ELEMENT_NAMES, elementRelation } from "./elements";
import type { Hexagram } from "./hexagrams";
import { lineLabel, LINE_NAMES, type Reading } from "./reading";
import type { Trigram } from "./trigrams";
import type { LinePosition } from "./types";

export interface LinePositionInfo {
  position: LinePosition;
  /** "Sơ", "Nhị", … "Thượng". */
  name: string;
  /** Tên hào đầy đủ, ví dụ "Cửu Ngũ". */
  label: string;
  yang: boolean;
  /** Ý nghĩa của vị trí hào trong quẻ. */
  role: string;
  /** Đắc chính: dương ở vị trí lẻ (1, 3, 5) hoặc âm ở vị trí chẵn (2, 4, 6). */
  correct: boolean;
  /** Đắc trung: hào ở giữa quẻ đơn (vị trí 2 hoặc 5). */
  central: boolean;
  /** Hào thuộc nội quái (dưới) hay ngoại quái (trên). */
  trigram: "lower" | "upper";
}

const LINE_ROLES: Readonly<Record<LinePosition, string>> = {
  1: "Khởi đầu, nền móng: việc mới manh nha, còn ẩn, nên thận trọng chưa vội hành động.",
  2: "Giữa nội quái, vị trí người thừa hành: ở trong, giữ mức vừa phải nên thường được tốt.",
  3: "Cuối nội quái, sắp bước ra ngoài: giai đoạn chuyển tiếp, dễ gặp nguy, cần cẩn trọng.",
  4: "Đầu ngoại quái, gần người lãnh đạo: được tin dùng nhưng phải khéo léo, dè dặt.",
  5: "Giữa ngoại quái, vị trí tôn quý của người lãnh đạo: thường là hào chủ của quẻ.",
  6: "Cực điểm, kết thúc: vật cực tất phản, cần biết dừng và lui đúng lúc.",
};

export function linePositionInfo(position: LinePosition, yang: boolean): LinePositionInfo {
  return {
    position,
    name: LINE_NAMES[position],
    label: lineLabel(position, yang),
    yang,
    role: LINE_ROLES[position],
    correct: (position % 2 === 1) === yang,
    central: position === 2 || position === 5,
    trigram: position <= 3 ? "lower" : "upper",
  };
}

export interface HexagramExplanation {
  /** Mô tả thượng quái và hạ quái. */
  structure: string;
  /** Quan hệ ngũ hành giữa nội quái và ngoại quái. */
  relation: string;
  lines: LinePositionInfo[];
}

function trigramPhrase(t: Trigram): string {
  return `${t.name} ${t.symbol} (${t.natureVi}, hành ${ELEMENT_NAMES[t.element]}, tính ${t.quality.toLowerCase()})`;
}

function relationPhrase(upper: Trigram, lower: Trigram): string {
  const u = ELEMENT_NAMES[upper.element];
  const l = ELEMENT_NAMES[lower.element];
  switch (elementRelation(lower.element, upper.element)) {
    case "same":
      return `Nội và ngoại cùng hành ${l}: trong ngoài hòa hợp, đồng lòng.`;
    case "a-generates-b":
      return `Nội sinh ngoại (${l} sinh ${u}): mình bỏ sức ra vun đắp cho hoàn cảnh, cho người khác.`;
    case "b-generates-a":
      return `Ngoại sinh nội (${u} sinh ${l}): hoàn cảnh bên ngoài nâng đỡ, hỗ trợ mình.`;
    case "a-overcomes-b":
      return `Nội khắc ngoại (${l} khắc ${u}): mình chế ngự được hoàn cảnh, nhưng phải tốn sức.`;
    case "b-overcomes-a":
      return `Ngoại khắc nội (${u} khắc ${l}): hoàn cảnh gây áp lực lên mình, cần nhẫn nại.`;
  }
}

/** Giải thích cấu trúc một quẻ: hai quẻ đơn, ngũ hành nội–ngoại, vị trí từng hào. */
export function explainHexagram(h: Hexagram): HexagramExplanation {
  return {
    structure:
      `Ngoại quái (ba hào trên) là ${trigramPhrase(h.upper)}, chỉ hoàn cảnh bên ngoài. ` +
      `Nội quái (ba hào dưới) là ${trigramPhrase(h.lower)}, chỉ bản thân và nội tình.`,
    relation: relationPhrase(h.upper, h.lower),
    lines: h.lines.map((bit, i) => linePositionInfo((i + 1) as LinePosition, bit === 1)),
  };
}

export type ExplanationKey = "overview" | "structure" | "changing" | "future" | "nuclear" | "related" | "guide";

export interface ExplanationSection {
  key: ExplanationKey;
  title: string;
  body: string;
}

function name(h: Hexagram): string {
  return `${h.number}. ${h.fullName}`;
}

/** Giải thích một lần gieo quẻ bằng lời dễ hiểu, theo từng phần. */
export function explainReading(r: Reading): ExplanationSection[] {
  const { primary, transformed, nuclear } = r;
  const e = explainHexagram(primary);
  const sections: ExplanationSection[] = [
    {
      key: "overview",
      title: "Tình thế hiện tại",
      body: `Quẻ chủ ${name(primary)} (${primary.hanzi}) — ${primary.meaning.toLowerCase()}. Quẻ chủ cho biết sự việc bạn hỏi đang ở trạng thái nào.`,
    },
    { key: "structure", title: "Cấu tạo quẻ", body: `${e.structure} ${e.relation}` },
  ];

  if (r.changingLines.length === 0) {
    sections.push({
      key: "changing",
      title: "Hào động",
      body: "Không có hào động: tình thế đang ổn định, ít biến chuyển trong thời gian tới.",
    });
  } else {
    const parts = r.changingLines.map((p) => {
      const value = r.cast[p - 1]!;
      const v = describeLineValue(value);
      const info = linePositionInfo(p, v.yang);
      const change = v.yang ? "dương chuyển thành âm" : "âm chuyển thành dương";
      return `${info.label} (hào ${p}, ${v.name.toLowerCase()}): ${change}. Vị trí này là ${info.role.charAt(0).toLowerCase()}${info.role.slice(1)}`;
    });
    sections.push({
      key: "changing",
      title: `Hào động (${r.changingLines.length})`,
      body: `Hào động là điểm sự việc đang thay đổi. ${parts.join(" ")}`,
    });
  }

  if (transformed) {
    sections.push({
      key: "future",
      title: "Chiều hướng",
      body: `Quẻ biến ${name(transformed)} — ${transformed.meaning.toLowerCase()}. Đây là hướng sự việc sẽ chuyển tới sau khi các hào động thay đổi.`,
    });
  }

  sections.push({
    key: "nuclear",
    title: "Diễn biến bên trong",
    body:
      nuclear.number === primary.number
        ? `Hỗ quái trùng với quẻ chủ (${name(nuclear)}): bên trong và bên ngoài nhất quán, không có ẩn tình.`
        : `Hỗ quái ${name(nuclear)} — ${nuclear.meaning.toLowerCase()}. Lấy từ hào 2 đến hào 5, cho thấy quá trình diễn ra ở giữa, những yếu tố ẩn bên trong.`,
  });
  sections.push({
    key: "related",
    title: "Góc nhìn khác",
    body:
      `Thác quái ${name(r.opposite)}: đảo ngược âm dương, là mặt đối lập của sự việc. ` +
      `Tổng quái ${name(r.inverted)}: lật ngược quẻ, là sự việc nhìn từ phía người kia.`,
  });
  sections.push({ key: "guide", title: "Nên đọc lời nào", body: r.guide.note });
  return sections;
}
