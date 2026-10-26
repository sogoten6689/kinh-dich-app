# Kinh Dịch App

Gieo quẻ và tra cứu Kinh Dịch: **web** (Vite + React, deploy Vercel) và **mobile** (Expo / React Native, deploy EAS), dùng chung lõi `@kinh-dich/core`.

## Tính năng (MVP)

- Gieo quẻ: 3 đồng xu, cỏ thi (mô phỏng xác suất), Mai Hoa theo hai số
- Quẻ chủ, hào động, quẻ biến, hỗ quái, thác quái, tổng quái
- Hướng dẫn đọc theo số hào động (Chu Hy), tên hào truyền thống
- Thể/Dụng và sinh khắc ngũ hành (Mai Hoa)
- Tra cứu 64 quẻ, tìm theo số / tên có hoặc không dấu / chữ Hán

Đặc tả đầy đủ: [docs/SPEC.md](docs/SPEC.md) · Nghiệp vụ: [docs/kinh-dich.md](docs/kinh-dich.md) · Deploy: [docs/DEPLOY.md](docs/DEPLOY.md)

## Chạy

```bash
npm install
npm run dev:web       # web
npm run dev:mobile    # Expo (quét QR bằng Expo Go)
npm run verify        # typecheck + test
```

## Làm việc với Claude Code

Repo có sẵn harness trong `.claude/` (xem [CLAUDE.md](CLAUDE.md)): hook chặn lệnh nguy hiểm, kiểm tra typecheck/test sau mỗi lần sửa, Stop hook giữ agent trong vòng lặp tới khi `npm run verify` xanh, skill `/feature-loop` và `/verify`, subagent `iching-reviewer` và `test-writer`.
