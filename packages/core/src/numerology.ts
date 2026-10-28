/**
 * Thần số học Pythagoras (cách tính phổ biến ở Việt Nam).
 * - Số chủ đạo: cộng mọi chữ số của ngày/tháng/năm sinh rồi rút gọn, giữ số bậc thầy 11, 22, 33.
 * - Họ tên: bỏ dấu, quy chữ cái về 1–9 theo bảng Pythagoras; nguyên âm A E I O U Y.
 */

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

const MASTER = new Set([11, 22, 33]);

function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

/** Cộng các chữ số đến khi còn một chữ số; mặc định giữ số bậc thầy 11, 22, 33. */
export function reduceNumber(n: number, keepMaster = true): number {
  let x = n;
  while (x > 9 && !(keepMaster && MASTER.has(x))) x = digitSum(x);
  return x;
}

/** Bỏ dấu tiếng Việt, đ → d, viết hoa. */
export function stripVietnamese(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
}

/** Giá trị chữ cái theo bảng Pythagoras: A=1 … I=9, J=1 … R=9, S=1 … Z=8. Ký tự khác = 0. */
export function letterValue(ch: string): number {
  const c = stripVietnamese(ch).charCodeAt(0);
  if (Number.isNaN(c) || c < 65 || c > 90) return 0;
  return ((c - 65) % 9) + 1;
}

const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

export interface NameNumbers {
  /** Số sứ mệnh (biểu đạt): mọi chữ cái. */
  expression: number;
  /** Số linh hồn: nguyên âm. */
  soul: number;
  /** Số nhân cách: phụ âm. */
  personality: number;
}

export function nameNumbers(fullName: string): NameNumbers {
  const letters = stripVietnamese(fullName).replace(/[^A-Z]/g, "").split("");
  const sum = (pred: (c: string) => boolean) => letters.filter(pred).reduce((s, c) => s + letterValue(c), 0);
  return {
    expression: reduceNumber(sum(() => true)),
    soul: reduceNumber(sum((c) => VOWELS.has(c))),
    personality: reduceNumber(sum((c) => !VOWELS.has(c))),
  };
}

export function lifePathNumber(b: BirthDate): number {
  return reduceNumber(digitSum(b.day) + digitSum(b.month) + digitSum(b.year));
}

export interface PersonalCycle {
  year: number;
  month: number;
  day: number;
}

/** Năm / tháng / ngày cá nhân tại thời điểm `now` (rút gọn 1–9). */
export function personalCycle(b: BirthDate, now: Date): PersonalCycle {
  const year = reduceNumber(digitSum(b.day) + digitSum(b.month) + digitSum(now.getFullYear()), false);
  const month = reduceNumber(year + now.getMonth() + 1, false);
  const day = reduceNumber(month + now.getDate(), false);
  return { year, month, day };
}

export interface Arrow {
  key: string;
  digits: readonly [number, number, number];
  name: string;
  meaning: string;
}

/** Tám đường trên biểu đồ ngày sinh (lưới 3×3: 3-6-9 / 2-5-8 / 1-4-7). */
const LINES: readonly { digits: readonly [number, number, number]; full: [string, string]; empty: [string, string] }[] = [
  { digits: [1, 2, 3], full: ["Mũi tên Kế hoạch", "Biết sắp xếp, làm việc có trình tự."], empty: ["Mũi tên trống Kế hoạch", "Dễ làm theo cảm hứng; nên tập lập kế hoạch."] },
  { digits: [4, 5, 6], full: ["Mũi tên Ý chí", "Quyết tâm cao, đã muốn là làm bằng được."], empty: ["Mũi tên trống Ý chí", "Dễ nản lòng, hay dồn nén; nên chia nhỏ mục tiêu."] },
  { digits: [7, 8, 9], full: ["Mũi tên Hoạt động", "Năng động, thích bắt tay vào việc."], empty: ["Mũi tên trống Hoạt động", "Dễ thụ động; cần một lý do rõ ràng để bắt đầu."] },
  { digits: [1, 4, 7], full: ["Mũi tên Thực tế", "Khéo tay, thực tế, giỏi biến ý tưởng thành việc."], empty: ["Mũi tên trống Thực tế", "Hay nghĩ nhiều hơn làm; nên rèn kỹ năng thực hành."] },
  { digits: [2, 5, 8], full: ["Mũi tên Cân bằng cảm xúc", "Cảm xúc ổn định, biết thấu hiểu người khác."], empty: ["Mũi tên trống Cảm xúc", "Nhạy cảm, dễ tổn thương; nên học cách bày tỏ."] },
  { digits: [3, 6, 9], full: ["Mũi tên Trí tuệ", "Trí nhớ tốt, ham học, tư duy sắc bén."], empty: ["Mũi tên trống Trí nhớ", "Hay quên chi tiết; nên ghi chép và ôn lại."] },
  { digits: [1, 5, 9], full: ["Mũi tên Quyết tâm", "Kiên định, theo đuổi mục tiêu đến cùng."], empty: ["Mũi tên trống Quyết tâm", "Dễ trì hoãn; đặt hạn chót sẽ giúp bạn rất nhiều."] },
  { digits: [3, 5, 7], full: ["Mũi tên Nhạy bén", "Trực giác tốt, có chiều sâu tâm hồn."], empty: ["Mũi tên trống Niềm tin", "Hay hoài nghi; tin vào bản thân hơn một chút."] },
];

export interface BirthChart {
  counts: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>;
  arrows: Arrow[];
  emptyArrows: Arrow[];
}

/** Biểu đồ ngày sinh: số lần mỗi chữ số 1–9 xuất hiện trong ddmmyyyy (bỏ số 0) và các mũi tên. */
export function birthChart(b: BirthDate): BirthChart {
  const s = `${String(b.day).padStart(2, "0")}${String(b.month).padStart(2, "0")}${b.year}`;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 } as BirthChart["counts"];
  for (const ch of s) {
    const d = Number(ch);
    if (d >= 1 && d <= 9) counts[d as 1]++;
  }
  const arrows: Arrow[] = [];
  const emptyArrows: Arrow[] = [];
  for (const line of LINES) {
    const key = line.digits.join("-");
    const present = line.digits.map((d) => counts[d as 1] > 0);
    if (present.every(Boolean)) arrows.push({ key, digits: line.digits, name: line.full[0], meaning: line.full[1] });
    else if (present.every((p) => !p)) emptyArrows.push({ key, digits: line.digits, name: line.empty[0], meaning: line.empty[1] });
  }
  return { counts, arrows, emptyArrows };
}

export interface NumberMeaning {
  title: string;
  summary: string;
  strengths: string;
  challenges: string;
  career: string;
  love: string;
}

export const NUMBER_MEANINGS: Readonly<Record<number, NumberMeaning>> = {
  1: {
    title: "Người tiên phong",
    summary: "Độc lập, chủ động, thích tự mình mở đường.",
    strengths: "Quyết đoán, dám nghĩ dám làm, có tố chất lãnh đạo.",
    challenges: "Dễ nóng vội, cái tôi lớn, ngại nhờ người khác giúp.",
    career: "Khởi nghiệp, quản lý, những việc cần người đi đầu.",
    love: "Cần người tôn trọng sự tự do của bạn; nhớ lắng nghe nhiều hơn.",
  },
  2: {
    title: "Người kết nối",
    summary: "Tinh tế, giàu trực giác, giỏi hòa giải và hợp tác.",
    strengths: "Thấu hiểu người khác, kiên nhẫn, làm việc nhóm tốt.",
    challenges: "Dễ nhạy cảm, hay lo nghĩ, khó nói lời từ chối.",
    career: "Tư vấn, nhân sự, ngoại giao, chăm sóc khách hàng, nghệ thuật.",
    love: "Chung thủy, chu đáo; cần cảm giác an toàn và được trân trọng.",
  },
  3: {
    title: "Người truyền cảm hứng",
    summary: "Vui vẻ, sáng tạo, giỏi giao tiếp và biểu đạt.",
    strengths: "Lạc quan, hài hước, trí nhớ và khả năng ngôn từ tốt.",
    challenges: "Dễ phân tán, cả thèm chóng chán, đôi khi nói nhiều hơn làm.",
    career: "Truyền thông, giáo dục, nghệ thuật, bán hàng, sáng tạo nội dung.",
    love: "Thích sự vui tươi, mới mẻ; cần học cách gắn bó lâu dài.",
  },
  4: {
    title: "Người xây dựng",
    summary: "Thực tế, kỷ luật, đáng tin cậy, thích mọi thứ rõ ràng.",
    strengths: "Chăm chỉ, tỉ mỉ, giữ lời, làm đến nơi đến chốn.",
    challenges: "Dễ cứng nhắc, ngại thay đổi, hay tự tạo áp lực.",
    career: "Kỹ thuật, tài chính, kế toán, xây dựng, quản lý vận hành.",
    love: "Thể hiện tình cảm bằng hành động; cần thêm chút lãng mạn.",
  },
  5: {
    title: "Người tự do",
    summary: "Ham trải nghiệm, linh hoạt, yêu sự thay đổi.",
    strengths: "Thích nghi nhanh, nhiều năng lượng, giỏi thuyết phục.",
    challenges: "Thiếu kiên nhẫn, dễ bốc đồng, ngại ràng buộc.",
    career: "Du lịch, kinh doanh, marketing, báo chí, công việc di chuyển nhiều.",
    love: "Cần không gian riêng và những điều mới lạ cùng nhau.",
  },
  6: {
    title: "Người chăm sóc",
    summary: "Giàu tình thương, trách nhiệm, đặt gia đình lên hàng đầu.",
    strengths: "Tận tâm, biết chăm lo, có óc thẩm mỹ và tính công bằng.",
    challenges: "Dễ ôm đồm, lo lắng thay người khác, cầu toàn.",
    career: "Y tế, giáo dục, công tác xã hội, thiết kế, dịch vụ.",
    love: "Rất chung thủy, chăm lo cho người mình thương; nhớ chăm lo cả bản thân.",
  },
  7: {
    title: "Người tìm kiếm chân lý",
    summary: "Sâu sắc, thích phân tích, cần thời gian ở một mình.",
    strengths: "Tư duy logic, ham học hỏi, trực giác và chiều sâu nội tâm.",
    challenges: "Dễ khép kín, hoài nghi, khó chia sẻ cảm xúc.",
    career: "Nghiên cứu, công nghệ, khoa học, phân tích, viết lách.",
    love: "Cần người hiểu sự trầm lặng của bạn; tin tưởng là chìa khóa.",
  },
  8: {
    title: "Người điều hành",
    summary: "Tham vọng, mạnh mẽ, giỏi quản lý tiền bạc và con người.",
    strengths: "Tầm nhìn kinh doanh, bản lĩnh, biết tổ chức.",
    challenges: "Dễ đặt nặng vật chất, áp đặt, làm việc quá sức.",
    career: "Kinh doanh, quản trị, tài chính, bất động sản, pháp lý.",
    love: "Bảo vệ và lo lắng cho người thân; nhớ dành thời gian cho cảm xúc.",
  },
  9: {
    title: "Người nhân ái",
    summary: "Lý tưởng, bao dung, muốn đóng góp cho cộng đồng.",
    strengths: "Rộng lượng, giàu cảm thông, có tầm nhìn lớn.",
    challenges: "Dễ ôm việc của người khác, khó buông bỏ quá khứ.",
    career: "Giáo dục, thiện nguyện, nghệ thuật, y tế, tổ chức xã hội.",
    love: "Yêu chân thành, vị tha; cần người cùng chí hướng.",
  },
  11: {
    title: "Bậc thầy trực giác (11/2)",
    summary: "Nhạy bén, giàu cảm hứng, có khả năng dẫn dắt tinh thần người khác.",
    strengths: "Trực giác mạnh, sáng tạo, truyền cảm hứng tự nhiên.",
    challenges: "Dễ căng thẳng, lo âu, cảm xúc lên xuống thất thường.",
    career: "Tư vấn, giảng dạy, nghệ thuật, chữa lành, truyền thông.",
    love: "Cần sự thấu hiểu sâu sắc và bình yên trong tâm hồn.",
  },
  22: {
    title: "Kiến trúc sư bậc thầy (22/4)",
    summary: "Biến ước mơ lớn thành hiện thực bằng sự bền bỉ và tổ chức.",
    strengths: "Tầm nhìn xa, thực tế, xây dựng được những điều lâu dài.",
    challenges: "Áp lực lớn từ kỳ vọng của chính mình, dễ kiệt sức.",
    career: "Quản lý dự án lớn, kiến trúc, kỹ thuật, lãnh đạo tổ chức.",
    love: "Cần người đồng hành vững vàng, chia sẻ gánh nặng.",
  },
  33: {
    title: "Người thầy chữa lành (33/6)",
    summary: "Yêu thương vô điều kiện, muốn nâng đỡ và chữa lành người khác.",
    strengths: "Bao dung, kiên nhẫn, có sức ảnh hưởng nhẹ nhàng mà sâu.",
    challenges: "Dễ hy sinh quá mức, quên chăm sóc bản thân.",
    career: "Giáo dục, y tế, tâm lý, nghệ thuật, công tác cộng đồng.",
    love: "Tình yêu bao la; học cách nhận lại yêu thương.",
  },
};

/** Chủ đề của năm / tháng / ngày cá nhân 1–9. */
export const CYCLE_THEMES: Readonly<Record<number, string>> = {
  1: "khởi đầu mới, gieo hạt cho điều mình muốn",
  2: "hợp tác, kiên nhẫn, vun đắp các mối quan hệ",
  3: "sáng tạo, giao lưu, thể hiện bản thân",
  4: "làm việc chăm chỉ, xây nền móng vững chắc",
  5: "thay đổi, trải nghiệm, đón cơ hội mới",
  6: "gia đình, trách nhiệm, yêu thương",
  7: "chiêm nghiệm, học hỏi, nhìn vào bên trong",
  8: "thành quả, tài chính, khẳng định bản thân",
  9: "hoàn tất, buông bỏ điều cũ, chuẩn bị chu kỳ mới",
};

export interface NumerologyReport {
  lifePath: number;
  birthDay: number;
  name: NameNumbers;
  cycle: PersonalCycle;
  chart: BirthChart;
}

export function numerologyReport(fullName: string, b: BirthDate, now: Date): NumerologyReport {
  return {
    lifePath: lifePathNumber(b),
    birthDay: reduceNumber(b.day),
    name: nameNumbers(fullName),
    cycle: personalCycle(b, now),
    chart: birthChart(b),
  };
}

/** "33/6", "11/2", "7" — cách viết số bậc thầy quen thuộc. */
export function numberLabel(n: number): string {
  return MASTER.has(n) ? `${n}/${reduceNumber(n, false)}` : String(n);
}
