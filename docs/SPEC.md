# Đặc tả sản phẩm — Kinh Dịch App

Phiên bản: 0.2. Nền tảng: Web (Vercel) và Mobile iOS/Android (Expo). Tác giả: Lam Nguyen — Egitech.

## 1. Mục tiêu

Giúp người dùng Việt gieo quẻ Kinh Dịch theo các phương pháp truyền thống, **thấy** quá trình lập quẻ (đồng xu lật, hào hiện dần, sơ đồ), và **hiểu** kết quả qua lời giải thích rõ ràng — chạy hoàn toàn trên thiết bị (không backend, không thu thập dữ liệu).

Ngoài phạm vi: tài khoản, lưu lịch sử trên server, thanh toán.

## 2. Nguyên tắc song song web ↔ mobile

- **Mọi tính năng phải có trên cả web và mobile**, cùng hành vi và cùng nội dung chữ. Một tính năng chỉ được đánh ✅ khi cả hai cột đều ✅.
- Logic và nội dung chữ (giải thích, thuật ngữ, mô tả phương pháp, giới thiệu, tác giả) nằm trong `@kinh-dich/core` (`explain.ts`, `glossary.ts`, `content.ts`); app chỉ hiển thị.
- Hình học sơ đồ (vòng ngũ hành, bát quái) giống nhau ở hai nền tảng; web dùng SVG DOM, mobile dùng `react-native-svg`.

## 3. Người dùng & ngữ cảnh

- Người mới: muốn gieo nhanh, hiểu kết quả bằng lời ngắn gọn, bấm vào thuật ngữ để được giải thích.
- Người đã biết Dịch: cần đúng thuật ngữ (hỗ quái, thác/tổng quái, Thể/Dụng, đắc chính/đắc trung, tên hào Sơ Cửu…).

## 4. Tính năng

Trạng thái: ✅ đã có · 🟡 một phần · ⬜ chưa làm. Mỗi mã tính năng được ghi trong tên test tương ứng.

### 4.1 Gieo quẻ (`F-CAST`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-CAST-01 | Gieo 3 đồng xu | Hào ∈ {6,7,8,9}, phân bố 1/8·3/8·3/8·1/8; lần 1 = hào sơ; hiện "3 + 3 + 2 = 8 → Thiếu âm" | ✅ | ✅ |
| F-CAST-02 | Gieo cỏ thi (mô phỏng xác suất) | Phân bố 1/16·5/16·7/16·3/16, có lời giải thích xác suất | ✅ | ✅ |
| F-CAST-03 | Mai Hoa theo hai số | (5,3) → quẻ 37, động hào 2, biến 9; hiện 3 bước chia lấy dư; số không hợp lệ → báo lỗi tiếng Việt kèm ví dụ | ✅ | ✅ |
| F-CAST-04 | Nhập tay kết quả gieo | 6 giá trị 6–9, sai → báo lỗi (`assertCastLines`) | 🟡 core | 🟡 core |
| F-CAST-05 | Gieo tái lập bằng seed | Cùng seed → cùng quẻ | 🟡 core | 🟡 core |
| F-CAST-06 | Gieo từng hào có hoạt ảnh | Bấm "Gieo hào N" 6 lần; 3 đồng xu lật; hào hiện dần từ dưới lên; "Gieo nhanh", "Gieo lại" | ✅ | ✅ |
| F-CAST-07 | Mai Hoa theo thời gian (âm lịch) | Cần module lịch âm + địa chi | ⬜ | ⬜ |
| F-CAST-08 | Ghi câu hỏi | Câu hỏi (không bắt buộc) hiện ở đầu kết quả | ✅ | ✅ |

### 4.2 Lập quẻ & luận giải (`F-READ`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-READ-01 | Quẻ chủ | Đúng số Văn Vương, tên đầy đủ, chữ Hán, ý nghĩa, ngoặc thượng/hạ quái | ✅ | ✅ |
| F-READ-02 | Hào động & quẻ biến | Hào động tô son, ký hiệu ○ (lão dương) / × (lão âm) trên quẻ chủ; mũi tên "biến thành" sang quẻ biến | ✅ | ✅ |
| F-READ-03 | Hỗ quái | Truân → Bác; Ký Tế → Vị Tế | ✅ | ✅ |
| F-READ-04 | Thác quái, tổng quái | Càn ↔ Khôn; Truân ↔ Mông; Thái ↔ Bĩ | ✅ | ✅ |
| F-READ-05 | Hướng dẫn đọc theo số hào động (Chu Hy) | Đủ 7 trường hợp 0–6, Càn/Khôn 6 hào động → Dụng Cửu/Dụng Lục | ✅ | ✅ |
| F-READ-06 | Tên hào truyền thống | Sơ Cửu, Lục Nhị, …, Thượng Lục | ✅ | ✅ |
| F-READ-07 | Thể/Dụng & ngũ hành (Mai Hoa) | 5 trường hợp sinh/khắc/tỷ hòa; vòng ngũ hành tô đậm quan hệ Thể–Dụng | ✅ | ✅ |
| F-READ-08 | Lời quẻ (thoán từ) & lời hào | Dữ liệu văn bản 64 quẻ × 7 lời | ⬜ | ⬜ |
| F-READ-09 | Giải thích quẻ theo phần | 7 phần: tình thế, cấu tạo (kèm ngũ hành nội–ngoại), hào động, chiều hướng, diễn biến bên trong, góc nhìn khác, nên đọc lời nào | ✅ | ✅ |
| F-READ-10 | Ý nghĩa vị trí hào | Vai trò từng vị trí 1–6, đắc chính / thất chính, đắc trung | ✅ | ✅ |

### 4.2b Xem theo chủ đề (`F-TOPIC`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-TOPIC-01 | Chọn chủ đề trước khi gieo | Tổng quát · Tình duyên · Công việc · Vận mệnh; Tổng quát không hiện thẻ chủ đề | ✅ | ✅ |
| F-TOPIC-02 | Luận theo chủ đề | Mức Cát/Bình/Hung hiện tại → chiều hướng, xu hướng (tốt lên / xấu đi / giữ nhịp / đứng yên), lời quẻ chủ và quẻ biến theo chủ đề, thay đổi đến từ nội hay ngoại quái, Thể – Dụng theo chủ đề (Mai Hoa), lời khuyên. Bĩ động 6 hào → Thái: tốt lên | ✅ | ✅ |
| F-TOPIC-03 | Chủ đề trong chi tiết quẻ | Mức cát/hung và lời tình duyên, công việc, vận mệnh cho đủ 64 quẻ | ✅ | ✅ |

### 4.3 Tra cứu (`F-LIB`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-LIB-01 | Danh sách 64 quẻ | Lưới hình quẻ đủ 64, đúng thứ tự Văn Vương | ✅ | ✅ |
| F-LIB-02 | Tìm kiếm | Theo số, tên có dấu/không dấu, chữ Hán ("vi te" → chỉ Vị Tế) | ✅ | ✅ |
| F-LIB-03 | Chi tiết quẻ | Hình quẻ, hai quẻ đơn (màu theo hành), quan hệ ngũ hành, bảng 6 hào, quẻ liên quan bấm được | ✅ | ✅ |
| F-LIB-04 | Bát quái | Sơ đồ bát giác, Thái cực ở tâm, Hậu Thiên ↔ Tiên Thiên, thẻ chi tiết (tính chất, hành, phương, gia đình, con vật, cơ thể) | ✅ | ✅ |
| F-LIB-05 | Thuật ngữ | Bấm thuật ngữ để xem giải thích; danh sách đầy đủ ở trang Giới thiệu | ✅ | ✅ |

### 4.4 Giới thiệu & thương hiệu (`F-ABOUT`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-ABOUT-01 | Trang giới thiệu | Kinh Dịch là gì, tính năng, cách dùng, lưu ý, **tác giả: Lam Nguyen — Egitech**, phiên bản | ✅ | ✅ |
| F-ABOUT-03 | Thông tin bản đang chạy & link chính thức | Link https://kinhdich-app.vercel.app. Web: kênh = môi trường Vercel, mã build = commit. Mobile: kênh EAS Update, mã build (phiên bản + versionCode), profile build (development / preview / apk / production), mã build EAS, runtime, bản cập nhật OTA hay bản gốc; dữ liệu lạ từ module native không làm sập trang | ✅ | ✅ |
| F-ABOUT-02 | Logo & icon | Logo ấn son quẻ Ly ☲; favicon SVG, apple-touch-icon; icon app, adaptive icon Android, splash | ✅ | ✅ |

### 4.5 Lịch sử & chia sẻ (`F-HIST`) — sau này

| Mã | Mô tả | Web | Mobile |
|---|---|---|---|
| F-HIST-01 | Lưu lịch sử gieo trên thiết bị kèm câu hỏi | ⬜ | ⬜ |
| F-HIST-02 | Chia sẻ quẻ qua liên kết | ⬜ | ⬜ |

## 5. Mô hình dữ liệu (core)

```ts
type LineValue = 6 | 7 | 8 | 9;          // từ dưới lên
interface Trigram  { key; name; symbol; nature; element; quality; animal; body; family; direction; earlyHeavenDirection; description; lines }
interface Hexagram { number; name; fullName; hanzi; meaning; upper; lower; lines }
interface Reading  { cast; primary; transformed | null; nuclear; opposite; inverted; changingLines; guide }
interface MeihuaResult { reading; movingLine; ti; yong; verdict; steps }
explainReading(reading) → ExplanationSection[]      // F-READ-09
explainHexagram(h)      → { structure, relation, lines: LinePositionInfo[] }   // F-READ-10
GLOSSARY, APP_INFO, CAST_METHODS, ABOUT             // nội dung dùng chung
```

Quy ước đầy đủ: `docs/kinh-dich.md`.

## 6. Yêu cầu phi chức năng

- **Đúng nghiệp vụ**: mọi quy tắc có test với ví dụ tính tay.
- **Offline**: không gọi mạng (trừ font web); toàn bộ tính toán ở client.
- **Chuyển động**: hoạt ảnh ngắn (≤ 1 s), tôn trọng `prefers-reduced-motion` trên web.
- **Truy cập**: điều khiển có nhãn, dùng được bằng bàn phím (web); không tràn ngang ở khổ 390px.
- **Ngôn ngữ**: tiếng Việt có dấu; tìm kiếm không dấu.
- **Chất lượng**: `npm run verify` xanh trên CI trước khi merge; deploy chỉ từ `main`.

## 7. Phát hành

- Web: Vercel, preview cho mỗi PR, production khi merge `main`.
- Mobile: EAS Workflows chạy trên máy chủ Expo (`apps/mobile/.eas/workflows/`): PR → kênh `preview`, `main` → kênh `production`; tự build lại khi fingerprint native đổi, nếu không chỉ đẩy EAS Update. Bản 0.2.0 thêm `react-native-svg` (native) nên lần đầu cần **build mới**.
- Chi tiết: `docs/DEPLOY.md`.

## 8. Lộ trình

1. v0.2 (hiện tại): giao diện trực quan, giải thích, bát quái, ngũ hành, giới thiệu, logo — song song web/mobile.
2. v0.3: F-READ-08 (lời quẻ/hào), F-HIST.
3. v0.4: F-CAST-07 (âm lịch), giao diện tối cho mobile.
