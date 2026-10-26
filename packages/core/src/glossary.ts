export interface GlossaryEntry {
  key: string;
  term: string;
  /** Giải thích một dòng. */
  short: string;
  detail: string;
}

/** Thuật ngữ Kinh Dịch dùng trong ứng dụng, giải thích cho người mới. */
export const GLOSSARY: readonly GlossaryEntry[] = [
  { key: "hao", term: "Hào", short: "Một vạch của quẻ", detail: "Vạch liền (—) là hào dương, vạch đứt (- -) là hào âm. Hào được đếm từ dưới lên: hào 1 (sơ) ở dưới cùng, hào 6 (thượng) ở trên cùng." },
  { key: "hao-dong", term: "Hào động", short: "Hào sắp đổi âm dương", detail: "Khi gieo ra lão dương (9) hoặc lão âm (6), hào đã đến cực nên sẽ đổi sang mặt ngược lại. Hào động là chỗ sự việc đang biến chuyển, thường là trọng tâm khi luận quẻ." },
  { key: "que-don", term: "Quẻ đơn (bát quái)", short: "Ba hào, có 8 quẻ", detail: "Tám quẻ đơn Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn tượng trưng cho Trời, Đầm, Lửa, Sấm, Gió, Nước, Núi, Đất. Hai quẻ đơn chồng lên nhau thành một quẻ kép." },
  { key: "que-kep", term: "Quẻ kép", short: "Sáu hào, có 64 quẻ", detail: "Gồm nội quái (ba hào dưới, chỉ bản thân) và ngoại quái (ba hào trên, chỉ hoàn cảnh). 64 quẻ được đánh số theo thứ tự Văn Vương." },
  { key: "que-chu", term: "Quẻ chủ (bản quái)", short: "Quẻ gieo được", detail: "Quẻ lập từ sáu hào vừa gieo, phản ánh tình thế hiện tại của việc được hỏi." },
  { key: "que-bien", term: "Quẻ biến (chi quái)", short: "Quẻ sau khi hào động đổi", detail: "Đổi âm dương các hào động của quẻ chủ sẽ được quẻ biến, cho biết chiều hướng sự việc sẽ đi tới. Không có hào động thì không có quẻ biến." },
  { key: "ho-quai", term: "Hỗ quái", short: "Quẻ ẩn bên trong", detail: "Lấy hào 2-3-4 làm quẻ dưới và hào 3-4-5 làm quẻ trên. Hỗ quái cho thấy diễn biến ở giữa, những yếu tố ẩn bên trong sự việc." },
  { key: "thac-quai", term: "Thác quái", short: "Đảo hết âm dương", detail: "Đổi cả sáu hào sang mặt ngược lại. Thác quái là mặt đối lập, giúp nhìn sự việc từ phía trái ngược." },
  { key: "tong-quai", term: "Tổng quái", short: "Lật ngược quẻ", detail: "Đảo thứ tự hào từ trên xuống dưới, như nhìn quẻ từ phía đối diện. Tổng quái là sự việc dưới con mắt của người bên kia." },
  { key: "the", term: "Thể", short: "Phía người hỏi (Mai Hoa)", detail: "Trong Mai Hoa Dịch Số, quẻ đơn không chứa hào động là Thể, đại diện cho người hỏi. Thể được sinh hoặc tỷ hòa là tốt, bị khắc là xấu." },
  { key: "dung", term: "Dụng", short: "Phía sự việc (Mai Hoa)", detail: "Quẻ đơn chứa hào động là Dụng, đại diện cho sự việc hoặc đối phương. So ngũ hành của Dụng với Thể để đoán cát hung." },
  { key: "ngu-hanh", term: "Ngũ hành", short: "Kim, Mộc, Thủy, Hỏa, Thổ", detail: "Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc. Tương khắc: Mộc → Thổ → Thủy → Hỏa → Kim → Mộc. Mỗi quẻ đơn thuộc một hành." },
  { key: "dac-chinh", term: "Đắc chính", short: "Hào đúng vị trí", detail: "Hào dương ở vị trí lẻ (1, 3, 5) hoặc hào âm ở vị trí chẵn (2, 4, 6) là đắc chính, tức ở đúng chỗ của mình. Ngược lại là thất chính." },
  { key: "dac-trung", term: "Đắc trung", short: "Hào ở giữa quẻ đơn", detail: "Hào 2 và hào 5 nằm giữa quẻ đơn dưới và trên, tượng trưng cho sự vừa phải, không thái quá. Hào vừa trung vừa chính thường rất tốt." },
  { key: "thoan-tu", term: "Thoán từ", short: "Lời của cả quẻ", detail: "Lời đoán chung cho cả quẻ (quái từ), tương truyền do Văn Vương soạn. Mỗi hào còn có lời riêng gọi là hào từ." },
  { key: "lao-thieu", term: "Lão – Thiếu", short: "Động hay tĩnh", detail: "Lão dương (9) và lão âm (6) là hào động. Thiếu dương (7) và thiếu âm (8) là hào tĩnh, giữ nguyên khi lập quẻ biến." },
];

export function glossaryEntry(key: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.key === key);
}
