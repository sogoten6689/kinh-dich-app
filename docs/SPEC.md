# Đặc tả sản phẩm — Kinh Dịch App

Phiên bản: 0.1 (MVP). Nền tảng: Web (Vercel) và Mobile iOS/Android (Expo).

## 1. Mục tiêu

Giúp người dùng Việt gieo quẻ Kinh Dịch theo các phương pháp truyền thống, xem quẻ chủ / hỗ / biến, và tra cứu 64 quẻ — chạy hoàn toàn trên thiết bị (không cần backend, không thu thập dữ liệu).

Ngoài phạm vi MVP: tài khoản, lưu lịch sử trên server, lời bình đầy đủ từng hào, thanh toán.

## 2. Người dùng & ngữ cảnh

- Người mới: muốn gieo nhanh, hiểu kết quả bằng lời ngắn gọn.
- Người đã biết Dịch: cần đúng thuật ngữ (hỗ quái, thác/tổng quái, Thể/Dụng, tên hào Sơ Cửu…).

## 3. Tính năng

Trạng thái: ✅ đã có · 🟡 một phần · ⬜ chưa làm. Mỗi mã tính năng được ghi trong tên test tương ứng.

### 3.1 Gieo quẻ (`F-CAST`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-CAST-01 | Gieo 3 đồng xu (6 lần) | Mỗi hào ∈ {6,7,8,9}, phân bố 1/8·3/8·3/8·1/8 (sai số ≤ 0.01 trên 80k mẫu); lần 1 = hào sơ | ✅ | ✅ |
| F-CAST-02 | Gieo cỏ thi (mô phỏng xác suất) | Phân bố 1/16·5/16·7/16·3/16 | ✅ | ⬜ |
| F-CAST-03 | Mai Hoa theo hai số | (5,3) → quẻ 37, động hào 2, biến 9; (8,16) → quẻ 2, động hào 6; số ≤ 0 hoặc lẻ thập phân → báo lỗi tiếng Việt | ✅ | ✅ |
| F-CAST-04 | Nhập tay kết quả gieo | 6 giá trị 6–9, sai → báo lỗi (`assertCastLines`) | 🟡 core | ⬜ |
| F-CAST-05 | Gieo tái lập bằng seed | Cùng seed → cùng quẻ | 🟡 core | ⬜ |
| F-CAST-06 | Gieo từng hào có hoạt ảnh đồng xu | Hiện mặt sấp/ngửa từng lần, 6 lần | ⬜ | ⬜ |
| F-CAST-07 | Mai Hoa theo thời gian (âm lịch) | Cần module lịch âm + địa chi | ⬜ | ⬜ |

### 3.2 Lập quẻ & luận giải (`F-READ`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-READ-01 | Quẻ chủ | Đúng số Văn Vương, tên đầy đủ, chữ Hán, ý nghĩa | ✅ | ✅ |
| F-READ-02 | Hào động & quẻ biến | Không hào động → không có quẻ biến; [9,8,8,8,7,8] → Truân biến Tỷ | ✅ | ✅ |
| F-READ-03 | Hỗ quái | Truân → Bác; Ký Tế → Vị Tế | ✅ | ✅ |
| F-READ-04 | Thác quái, tổng quái | Càn ↔ Khôn; Truân ↔ Mông; Thái ↔ Bĩ | ✅ | ⬜ |
| F-READ-05 | Hướng dẫn đọc theo số hào động (Chu Hy) | Đủ 7 trường hợp 0–6, Càn/Khôn 6 hào động → Dụng Cửu/Dụng Lục | ✅ | ✅ |
| F-READ-06 | Tên hào truyền thống | Sơ Cửu, Lục Nhị, …, Thượng Lục | ✅ | ✅ |
| F-READ-07 | Thể/Dụng & ngũ hành (Mai Hoa) | 5 trường hợp sinh/khắc/tỷ hòa cho kết luận đúng | ✅ | ✅ |
| F-READ-08 | Lời quẻ (thoán từ) & lời hào | Dữ liệu văn bản 64 quẻ × 7 lời | ⬜ | ⬜ |

### 3.3 Tra cứu (`F-LIB`)

| Mã | Mô tả | Tiêu chí chấp nhận | Web | Mobile |
|---|---|---|---|---|
| F-LIB-01 | Danh sách 64 quẻ | Đủ 64, đúng thứ tự Văn Vương, ký hiệu thượng/hạ quái | ✅ | ✅ |
| F-LIB-02 | Tìm kiếm | Theo số, tên có dấu/không dấu, chữ Hán ("vi te" → chỉ Vị Tế) | ✅ | ✅ |
| F-LIB-03 | Chi tiết quẻ | Hình quẻ, tên, ý nghĩa khi chọn | ✅ | ✅ |
| F-LIB-04 | Bát quái | Bảng 8 quẻ đơn: tượng, ngũ hành, phương vị, gia đình | 🟡 core | ⬜ |

### 3.4 Lịch sử & chia sẻ (`F-HIST`) — sau MVP

| Mã | Mô tả | Web | Mobile |
|---|---|---|---|
| F-HIST-01 | Lưu lịch sử gieo trên thiết bị (localStorage / AsyncStorage) kèm câu hỏi | ⬜ | ⬜ |
| F-HIST-02 | Chia sẻ quẻ qua URL (`?cast=978878`) | ⬜ | ⬜ |

## 4. Mô hình dữ liệu (core)

```ts
type LineValue = 6 | 7 | 8 | 9;          // từ dưới lên
type CastLines = [LineValue × 6];
interface Hexagram { number; name; fullName; hanzi; meaning; upper: Trigram; lower: Trigram; lines: Bit[6] }
interface Reading  { cast; primary; transformed | null; nuclear; opposite; inverted; changingLines; guide }
interface MeihuaResult { reading; movingLine; ti; yong; verdict }
```

Quy ước đầy đủ: `docs/kinh-dich.md`.

## 5. Yêu cầu phi chức năng

- **Đúng nghiệp vụ**: mọi quy tắc có test với ví dụ tính tay; dữ liệu 64 quẻ được test tính duy nhất và tra ngược.
- **Offline**: không gọi mạng; toàn bộ tính toán ở client.
- **Hiệu năng**: lập quẻ < 1 ms; bundle web < 200 kB (gzip < 70 kB).
- **Truy cập**: điều khiển có nhãn (aria-label), dùng được bằng bàn phím; hỗ trợ dark mode (web).
- **Ngôn ngữ**: tiếng Việt có dấu; tìm kiếm không dấu.
- **Chất lượng**: `npm run verify` xanh trên CI trước khi merge; deploy chỉ từ `main`.

## 6. Phát hành

- Web: Vercel, preview cho mỗi PR, production khi merge `main`.
- Mobile: EAS Update (OTA, kênh `preview` cho PR / `production` cho `main`); bản cài đặt qua EAS Build khi cần lên store.
- Chi tiết: `docs/DEPLOY.md`.

## 7. Lộ trình

1. MVP (hiện tại): F-CAST-01..03, F-READ-01..07, F-LIB-01..03.
2. v0.2: F-READ-08 (lời quẻ/hào), F-CAST-06 hoạt ảnh, F-LIB-04, parity mobile (cỏ thi, thác/tổng quái).
3. v0.3: F-HIST, F-CAST-07 (âm lịch).
