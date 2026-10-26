---
name: verify
description: Chạy toàn bộ cổng chất lượng (typecheck + test core, web, mobile; build web; bundle mobile) rồi tóm tắt kết quả. Dùng trước khi commit hoặc khi người dùng hỏi "code có chạy không".
---

1. Chạy `npm run verify` ở thư mục gốc.
2. Nếu thay đổi chạm `apps/mobile` hoặc thêm export mới ở `packages/core`: chạy thêm `npm run bundle:check -w @kinh-dich/mobile`.
3. Nếu thay đổi chạm `apps/web`: chạy thêm `npm run build`.
4. Báo cáo: mỗi bước xanh/đỏ, số test pass/fail, và cập nhật cột trạng thái trong `docs/SPEC.md` nếu tính năng đổi trạng thái. Nếu đỏ, trích đúng thông điệp lỗi và nguyên nhân gốc — không nói "đã xong" khi còn đỏ.
