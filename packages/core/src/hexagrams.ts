import { TRIGRAMS, trigramFromLines, type Trigram } from "./trigrams";
import type { HexagramLines, TrigramKey, TrigramLines } from "./types";

export interface Hexagram {
  /** Số thứ tự theo Văn Vương (King Wen) 1..64. */
  number: number;
  /** Tên ngắn, ví dụ "Truân". */
  name: string;
  /** Tên đầy đủ: Thượng + Hạ + tên ngắn, ví dụ "Thủy Lôi Truân"; quẻ thuần: "Thuần Càn". */
  fullName: string;
  hanzi: string;
  /** Ý nghĩa tóm tắt. */
  meaning: string;
  upper: Trigram;
  lower: Trigram;
  /** Sáu hào từ dưới lên trên. */
  lines: HexagramLines;
}

/** Tên ngắn, chữ Hán, ý nghĩa — theo thứ tự Văn Vương (chỉ số 0 = quẻ số 1). */
const HEXAGRAM_TEXT: readonly (readonly [string, string, string])[] = [
  ["Càn", "乾", "Sáng tạo, cương kiện"],
  ["Khôn", "坤", "Tiếp nhận, nhu thuận"],
  ["Truân", "屯", "Gian nan buổi đầu"],
  ["Mông", "蒙", "Non nớt, cần học hỏi"],
  ["Nhu", "需", "Chờ đợi"],
  ["Tụng", "訟", "Tranh chấp, kiện tụng"],
  ["Sư", "師", "Quân đội, kỷ luật"],
  ["Tỷ", "比", "Thân cận, liên kết"],
  ["Tiểu Súc", "小畜", "Tích chứa nhỏ, kiềm chế nhẹ"],
  ["Lý", "履", "Lễ độ, thận trọng bước đi"],
  ["Thái", "泰", "Thông suốt, hanh thông"],
  ["Bĩ", "否", "Bế tắc"],
  ["Đồng Nhân", "同人", "Hòa đồng với người"],
  ["Đại Hữu", "大有", "Có nhiều, sung túc"],
  ["Khiêm", "謙", "Khiêm tốn"],
  ["Dự", "豫", "Vui vẻ, dự bị"],
  ["Tùy", "隨", "Thuận theo"],
  ["Cổ", "蠱", "Sửa chữa đổ nát"],
  ["Lâm", "臨", "Đến gần, giám lâm"],
  ["Quán", "觀", "Quan sát"],
  ["Phệ Hạp", "噬嗑", "Cắn hợp, trừng trị"],
  ["Bí", "賁", "Trang sức, văn vẻ"],
  ["Bác", "剝", "Bóc mòn, suy tàn"],
  ["Phục", "復", "Trở lại, phục hồi"],
  ["Vô Vọng", "無妄", "Chân thật, không càn bậy"],
  ["Đại Súc", "大畜", "Tích chứa lớn"],
  ["Di", "頤", "Nuôi dưỡng"],
  ["Đại Quá", "大過", "Quá mức lớn"],
  ["Khảm", "坎", "Hiểm trở"],
  ["Ly", "離", "Sáng sủa, bám dựa"],
  ["Hàm", "咸", "Cảm ứng"],
  ["Hằng", "恆", "Bền lâu"],
  ["Độn", "遯", "Lui ẩn"],
  ["Đại Tráng", "大壯", "Lớn mạnh"],
  ["Tấn", "晉", "Tiến lên"],
  ["Minh Di", "明夷", "Ánh sáng bị che lấp"],
  ["Gia Nhân", "家人", "Người nhà"],
  ["Khuê", "睽", "Chia lìa, trái ngược"],
  ["Kiển", "蹇", "Khó khăn, trở ngại"],
  ["Giải", "解", "Tháo gỡ, giải thoát"],
  ["Tổn", "損", "Giảm bớt"],
  ["Ích", "益", "Tăng thêm"],
  ["Quải", "夬", "Quyết đoán"],
  ["Cấu", "姤", "Gặp gỡ"],
  ["Tụy", "萃", "Tụ họp"],
  ["Thăng", "升", "Đi lên"],
  ["Khốn", "困", "Khốn cùng"],
  ["Tỉnh", "井", "Cái giếng, nguồn nuôi"],
  ["Cách", "革", "Đổi mới, cải cách"],
  ["Đỉnh", "鼎", "Cái vạc, ổn định"],
  ["Chấn", "震", "Chấn động"],
  ["Cấn", "艮", "Dừng lại"],
  ["Tiệm", "漸", "Tiến dần"],
  ["Quy Muội", "歸妹", "Em gái về nhà chồng"],
  ["Phong", "豐", "Thịnh lớn"],
  ["Lữ", "旅", "Lữ khách"],
  ["Tốn", "巽", "Thuận nhập"],
  ["Đoài", "兌", "Vui vẻ"],
  ["Hoán", "渙", "Ly tán"],
  ["Tiết", "節", "Tiết chế"],
  ["Trung Phu", "中孚", "Thành tín bên trong"],
  ["Tiểu Quá", "小過", "Quá mức nhỏ"],
  ["Ký Tế", "既濟", "Đã xong"],
  ["Vị Tế", "未濟", "Chưa xong"],
];

/**
 * Bảng tra số quẻ Văn Vương: KING_WEN_TABLE[hạ quái][thượng quái].
 * Thứ tự cột/hàng: Càn, Chấn, Khảm, Cấn, Khôn, Tốn, Ly, Đoài.
 */
const TABLE_ORDER: readonly TrigramKey[] = ["qian", "zhen", "kan", "gen", "kun", "xun", "li", "dui"];
const KING_WEN_TABLE: readonly (readonly number[])[] = [
  [1, 34, 5, 26, 11, 9, 14, 43], // hạ Càn
  [25, 51, 3, 27, 24, 42, 21, 17], // hạ Chấn
  [6, 40, 29, 4, 7, 59, 64, 47], // hạ Khảm
  [33, 62, 39, 52, 15, 53, 56, 31], // hạ Cấn
  [12, 16, 8, 23, 2, 20, 35, 45], // hạ Khôn
  [44, 32, 48, 18, 46, 57, 50, 28], // hạ Tốn
  [13, 55, 63, 22, 36, 37, 30, 49], // hạ Ly
  [10, 54, 60, 41, 19, 61, 38, 58], // hạ Đoài
];

function buildHexagrams(): readonly Hexagram[] {
  const byNumber: Hexagram[] = new Array(64);
  TABLE_ORDER.forEach((lowerKey, row) => {
    TABLE_ORDER.forEach((upperKey, col) => {
      const number = KING_WEN_TABLE[row]![col]!;
      const [name, hanzi, meaning] = HEXAGRAM_TEXT[number - 1]!;
      const lower = TRIGRAMS[lowerKey];
      const upper = TRIGRAMS[upperKey];
      const fullName = upper.key === lower.key ? `Thuần ${name}` : `${upper.nature} ${lower.nature} ${name}`;
      byNumber[number - 1] = {
        number,
        name,
        fullName,
        hanzi,
        meaning,
        upper,
        lower,
        lines: [...lower.lines, ...upper.lines] as unknown as HexagramLines,
      };
    });
  });
  return Object.freeze(byNumber);
}

/** 64 quẻ theo thứ tự Văn Vương; HEXAGRAMS[0] là quẻ số 1 (Thuần Càn). */
export const HEXAGRAMS: readonly Hexagram[] = buildHexagrams();

export function hexagramByNumber(n: number): Hexagram {
  const h = HEXAGRAMS[n - 1];
  if (!h || !Number.isInteger(n)) throw new RangeError(`Số quẻ phải từ 1 đến 64, nhận: ${n}`);
  return h;
}

export function hexagramFromTrigrams(upper: TrigramKey, lower: TrigramKey): Hexagram {
  const row = TABLE_ORDER.indexOf(lower);
  const col = TABLE_ORDER.indexOf(upper);
  return hexagramByNumber(KING_WEN_TABLE[row]![col]!);
}

export function hexagramFromLines(lines: HexagramLines): Hexagram {
  const lower = trigramFromLines(lines.slice(0, 3) as unknown as TrigramLines);
  const upper = trigramFromLines(lines.slice(3, 6) as unknown as TrigramLines);
  return hexagramFromTrigrams(upper.key, lower.key);
}

/** Hỗ quái: hào 2-3-4 làm hạ quái, hào 3-4-5 làm thượng quái. */
export function nuclearHexagram(h: Hexagram): Hexagram {
  const l = h.lines;
  return hexagramFromLines([l[1], l[2], l[3], l[2], l[3], l[4]]);
}

/** Thác quái (quẻ đối): đảo âm dương cả sáu hào. */
export function oppositeHexagram(h: Hexagram): Hexagram {
  return hexagramFromLines(h.lines.map((b) => (b === 1 ? 0 : 1)) as unknown as HexagramLines);
}

/** Tổng quái (quẻ phản/ngược): lật quẻ từ trên xuống dưới. */
export function invertedHexagram(h: Hexagram): Hexagram {
  return hexagramFromLines([...h.lines].reverse() as unknown as HexagramLines);
}

/** Tìm quẻ theo số, tên ngắn hoặc tên đầy đủ (không phân biệt hoa thường, bỏ dấu). */
export function searchHexagrams(query: string): Hexagram[] {
  const q = normalize(query);
  if (!q) return [...HEXAGRAMS];
  return HEXAGRAMS.filter(
    (h) => String(h.number) === q || normalize(h.name).includes(q) || normalize(h.fullName).includes(q) || h.hanzi.includes(query.trim()),
  );
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
