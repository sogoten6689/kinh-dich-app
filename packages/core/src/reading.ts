import { isChanging, isYang } from "./casting";
import { hexagramFromLines, nuclearHexagram, oppositeHexagram, invertedHexagram, type Hexagram } from "./hexagrams";
import type { CastLines, HexagramLines, LinePosition } from "./types";

export interface Reading {
  cast: CastLines;
  /** Quẻ chủ (bản quái). */
  primary: Hexagram;
  /** Quẻ biến (chi quái) — null nếu không có hào động. */
  transformed: Hexagram | null;
  /** Hỗ quái của quẻ chủ. */
  nuclear: Hexagram;
  /** Thác quái (đảo âm dương) của quẻ chủ. */
  opposite: Hexagram;
  /** Tổng quái (lật ngược) của quẻ chủ. */
  inverted: Hexagram;
  /** Các hào động, 1..6 từ dưới lên. */
  changingLines: LinePosition[];
  guide: ReadingGuide;
}

export interface ReadingGuide {
  /** Quẻ cần đọc lời: quẻ chủ hay quẻ biến. */
  focus: "primary" | "transformed" | "both";
  /** Các hào cần đọc lời hào (vị trí trên quẻ được focus). */
  lines: LinePosition[];
  /** Hào làm chủ (nếu có). */
  mainLine: LinePosition | null;
  note: string;
}

export const LINE_NAMES: Readonly<Record<LinePosition, string>> = {
  1: "Sơ",
  2: "Nhị",
  3: "Tam",
  4: "Tứ",
  5: "Ngũ",
  6: "Thượng",
};

/** Tên hào kiểu truyền thống: "Sơ Cửu", "Lục Nhị", "Thượng Lục"... */
export function lineLabel(position: LinePosition, yang: boolean): string {
  const kind = yang ? "Cửu" : "Lục";
  if (position === 1) return `Sơ ${kind}`;
  if (position === 6) return `Thượng ${kind}`;
  return `${kind} ${LINE_NAMES[position]}`;
}

/** Lập quẻ từ 6 giá trị hào gieo được. */
export function buildReading(cast: CastLines): Reading {
  const primaryLines = cast.map((v) => (isYang(v) ? 1 : 0)) as unknown as HexagramLines;
  const changingLines = cast.flatMap((v, i) => (isChanging(v) ? [(i + 1) as LinePosition] : []));
  const primary = hexagramFromLines(primaryLines);
  const transformed =
    changingLines.length === 0
      ? null
      : hexagramFromLines(cast.map((v, i) => (isChanging(v) ? 1 - primaryLines[i]! : primaryLines[i]!)) as unknown as HexagramLines);
  return {
    cast,
    primary,
    transformed,
    nuclear: nuclearHexagram(primary),
    opposite: oppositeHexagram(primary),
    inverted: invertedHexagram(primary),
    changingLines,
    guide: readingGuide(changingLines, primary),
  };
}

/**
 * Quy tắc đọc quẻ theo số hào động (theo Chu Hy, "Dịch học khải mông").
 */
export function readingGuide(changing: readonly LinePosition[], primary?: Hexagram): ReadingGuide {
  const all: LinePosition[] = [1, 2, 3, 4, 5, 6];
  const still = all.filter((p) => !changing.includes(p));
  switch (changing.length) {
    case 0:
      return { focus: "primary", lines: [], mainLine: null, note: "Không có hào động: xem lời thoán (quái từ) của quẻ chủ." };
    case 1:
      return { focus: "primary", lines: [...changing], mainLine: changing[0]!, note: "Một hào động: xem lời hào động đó của quẻ chủ." };
    case 2:
      return {
        focus: "primary",
        lines: [...changing],
        mainLine: changing[1]!,
        note: "Hai hào động: xem lời hai hào động của quẻ chủ, lấy hào trên làm chủ.",
      };
    case 3:
      return {
        focus: "both",
        lines: [],
        mainLine: null,
        note: "Ba hào động: xem lời thoán của quẻ chủ và quẻ biến, quẻ chủ là chính (thể), quẻ biến là phụ (dụng).",
      };
    case 4:
      return {
        focus: "transformed",
        lines: still,
        mainLine: still[0]!,
        note: "Bốn hào động: xem lời hai hào tĩnh của quẻ biến, lấy hào dưới làm chủ.",
      };
    case 5:
      return { focus: "transformed", lines: still, mainLine: still[0]!, note: "Năm hào động: xem lời hào tĩnh duy nhất của quẻ biến." };
    default: {
      const special =
        primary?.number === 1 ? " Riêng quẻ Càn xem lời \"Dụng Cửu\"." : primary?.number === 2 ? " Riêng quẻ Khôn xem lời \"Dụng Lục\"." : "";
      return { focus: "transformed", lines: [], mainLine: null, note: `Sáu hào động: xem lời thoán của quẻ biến.${special}` };
    }
  }
}
