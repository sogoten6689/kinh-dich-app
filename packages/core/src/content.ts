/** Nội dung hiển thị dùng chung cho web và mobile — sửa ở đây để hai nền tảng luôn giống nhau. */

export const APP_INFO = {
  name: "Kinh Dịch",
  tagline: "Gieo quẻ · Tra cứu · Giải nghĩa",
  version: "0.3.0",
  author: "Lam Nguyen",
  organization: "Egitech",
  /** Trang web chính thức. */
  website: "https://kinhdich-app.vercel.app",
} as const;

export type CastMethod = "coins" | "yarrow" | "numbers";

export const CAST_METHODS: readonly { id: CastMethod; name: string; hint: string; howTo: string }[] = [
  {
    id: "coins",
    name: "Gieo 3 đồng xu",
    hint: "Cách phổ biến nhất. Gieo 6 lần, mỗi lần được một hào, từ dưới lên.",
    howTo: "Mỗi lần gieo 3 đồng xu. Mặt có chữ (ngửa) tính 3, mặt trơn (sấp) tính 2. Tổng 6, 7, 8 hoặc 9 cho biết hào âm hay dương, động hay tĩnh.",
  },
  {
    id: "yarrow",
    name: "Cỏ thi",
    hint: "Mô phỏng phép bói cổ bằng 50 cọng cỏ thi; hào động ít xuất hiện hơn.",
    howTo: "Mỗi hào được chia cỏ thi ba lần. Xác suất: lão âm 1/16, thiếu dương 5/16, thiếu âm 7/16, lão dương 3/16 — nên quẻ ít khi có nhiều hào động.",
  },
  {
    id: "numbers",
    name: "Mai Hoa — hai số",
    hint: "Nghĩ ra hai số bất kỳ; lập quẻ bằng phép chia lấy dư theo Thiệu Khang Tiết.",
    howTo: "Số Tiên Thiên: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8. Chia hết thì lấy 8 (với quẻ) hoặc 6 (với hào).",
  },
];

export const ABOUT = {
  intro: "Ứng dụng gieo quẻ và tra cứu Kinh Dịch bằng tiếng Việt, cho cả người mới tìm hiểu lẫn người đã quen thuộc với Dịch học.",
  whatIs: [
    "Kinh Dịch (易經) là bộ sách cổ của Trung Hoa, đứng đầu Ngũ Kinh, bàn về sự biến đổi của vạn vật qua hai yếu tố âm và dương. Từ hai vạch âm (- -) và dương (—) hình thành 8 quẻ đơn (bát quái), rồi ghép đôi thành 64 quẻ kép. Mỗi quẻ mô tả một tình thế, kèm lời khuyên nên tiến hay lùi, cứng hay mềm.",
    "Người xưa gieo quẻ để soi lại hoàn cảnh của mình. Ứng dụng này giúp bạn gieo quẻ theo các phương pháp truyền thống và hiểu kết quả bằng lời dễ hiểu.",
  ],
  features: [
    ["Gieo quẻ", "bằng 3 đồng xu (từng hào, có hoạt ảnh), cỏ thi, hoặc Mai Hoa Dịch Số theo hai số."],
    ["Lập quẻ đầy đủ", "quẻ chủ, hào động, quẻ biến, hỗ quái, thác quái, tổng quái."],
    ["Giải thích", "từng phần: cấu tạo quẻ, quan hệ ngũ hành, ý nghĩa vị trí hào, nên đọc lời nào."],
    ["Xem theo chủ đề", "tình duyên, công việc, vận mệnh: mức cát/hung, chiều hướng và lời khuyên."],
    ["Thể – Dụng", "theo Mai Hoa, minh họa trên vòng ngũ hành."],
    ["Tra cứu", "64 quẻ và bát quái Tiên Thiên / Hậu Thiên."],
  ] as readonly (readonly [string, string])[],
  howTo: [
    "Tĩnh tâm, nghĩ rõ một câu hỏi cụ thể.",
    "Chọn phương pháp và gieo đủ 6 hào (từ dưới lên).",
    "Đọc phần giải thích: tình thế hiện tại, hào động, chiều hướng, rồi tự liên hệ với hoàn cảnh của mình.",
  ],
  disclaimer:
    "Nội dung mang tính tham khảo văn hóa và chiêm nghiệm, không thay thế lời khuyên chuyên môn về sức khỏe, pháp lý hay tài chính. Mọi tính toán chạy trên thiết bị của bạn; ứng dụng không thu thập dữ liệu.",
  wuxing:
    "Mỗi quẻ đơn thuộc một hành. Đi quanh vòng tròn là tương sinh (Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc); các đường chéo là tương khắc (Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc).",
  bagua:
    "Tám quẻ đơn là nền tảng của 64 quẻ. Mỗi quẻ có ba hào, tượng trưng cho một hiện tượng tự nhiên, một hành và một phương hướng. Bấm vào một quẻ để xem chi tiết.",
  library: "Mỗi quẻ gồm hai quẻ đơn chồng lên nhau. Bấm vào một quẻ để xem cấu tạo, ý nghĩa từng hào và các quẻ liên quan.",
} as const;
