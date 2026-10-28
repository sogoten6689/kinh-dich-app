# Thần số học & hồ sơ — quy tắc tính (tham chiếu cho code)

Code: `packages/core/src/numerology.ts`, `packages/core/src/profile.ts`. Test: `packages/core/test/numerology.test.ts`.

## Hồ sơ

- Gồm **họ tên** và **ngày sinh dương lịch**, nhập dạng `ngày/tháng/năm` (chấp nhận `/ - .` hoặc khoảng trắng).
- Chỉ lưu trên thiết bị: web dùng `localStorage`, mobile dùng `AsyncStorage`, cùng khóa `kinhdich.profile`. Có nút "Xóa thông tin đã lưu".
- Tên gọi = chữ cuối của họ tên (Nguyễn Văn **An**). Lời chào theo giờ: 4–10h sáng, 11–13h trưa, 14–17h chiều, còn lại tối.

## Tuổi và can chi

- **Tuổi** = tuổi tròn dương lịch; **tuổi mụ** = năm hiện tại − năm sinh + 1.
- **Can** theo `năm mod 10`: 0 Canh, 1 Tân, 2 Nhâm, 3 Quý, 4 Giáp, 5 Ất, 6 Bính, 7 Đinh, 8 Mậu, 9 Kỷ.
- **Chi** theo `năm mod 12`: 0 Thân, 1 Dậu, 2 Tuất, 3 Hợi, 4 Tý, 5 Sửu, 6 Dần, 7 Mão, 8 Thìn, 9 Tỵ, 10 Ngọ, 11 Mùi. Con giáp Việt Nam: Mão là **Mèo**.
- Ví dụ: 1990 Canh Ngọ, 1987 Đinh Mão, 2000 Canh Thìn, 2024 Giáp Thìn.
- Năm âm lịch bắt đầu từ Tết (cuối tháng 1 – giữa tháng 2). Người sinh tháng 1 hoặc trước 21/2 được nhắc: nếu sinh trước Tết thì tuổi âm thuộc năm trước (ví dụ 20/01/1990 → Kỷ Tỵ). App chưa có lịch âm nên không tự xác định.

## Thần số học Pythagoras

- **Rút gọn**: cộng các chữ số đến khi còn 1 chữ số; giữ **số bậc thầy 11, 22, 33** (hiển thị 11/2, 22/4, 33/6). Chu kỳ cá nhân không giữ số bậc thầy.
- **Số chủ đạo** = cộng mọi chữ số của ngày, tháng, năm sinh rồi rút gọn. 15/08/1990 → 1+5+0+8+1+9+9+0 = 33.
- **Số ngày sinh** = rút gọn ngày sinh (15 → 6).
- **Bảng chữ cái** (bỏ dấu, đ → d): A J S = 1, B K T = 2, C L U = 3, D M V = 4, E N W = 5, F O X = 6, G P Y = 7, H Q Z = 8, I R = 9. Nguyên âm: A E I O U Y.
  - **Số sứ mệnh** = mọi chữ cái; **số linh hồn** = nguyên âm; **số nhân cách** = phụ âm.
  - Ví dụ "Nguyễn Văn An" → NGUYEN VAN AN: sứ mệnh 48 → 3, linh hồn 17 → 8, nhân cách 31 → 4.
- **Năm cá nhân** = ngày + tháng sinh + năm hiện tại (cộng chữ số, rút gọn 1–9); **tháng cá nhân** = năm cá nhân + tháng hiện tại; **ngày cá nhân** = tháng cá nhân + ngày hiện tại.
  - 15/08, ngày 28/10/2026: năm 6, tháng 7, ngày 8.
- **Biểu đồ ngày sinh**: các chữ số 1–9 trong `ddmmyyyy` (bỏ số 0) xếp vào lưới 3–6–9 / 2–5–8 / 1–4–7.
  - **Mũi tên đầy** (đủ cả 3 số) và **mũi tên trống** (thiếu cả 3) trên 8 đường: 1-2-3 Kế hoạch, 4-5-6 Ý chí, 7-8-9 Hoạt động, 1-4-7 Thực tế, 2-5-8 Cảm xúc, 3-6-9 Trí tuệ / Trí nhớ, 1-5-9 Quyết tâm, 3-5-7 Nhạy bén / Niềm tin.
  - 15/08/1990 → 1:2, 5:1, 8:1, 9:2; mũi tên Quyết tâm (1-5-9).
- Ý nghĩa các số 1–9, 11, 22, 33 và chủ đề chu kỳ 1–9 nằm trong `NUMBER_MEANINGS`, `CYCLE_THEMES`.

Nội dung mang tính tham khảo và chiêm nghiệm, viết theo cách hiểu phổ biến của thần số học Pythagoras ở Việt Nam.
