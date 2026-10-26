# Kinh Dịch App — hướng dẫn cho Claude

Ứng dụng Kinh Dịch (I Ching) gồm **web** và **mobile**, dùng chung một lõi tính toán.
Đặc tả tính năng: `docs/SPEC.md`. Kiến thức nghiệp vụ: `docs/kinh-dich.md`. Deploy: `docs/DEPLOY.md`.

## Cấu trúc (npm workspaces)

| Thư mục | Package | Vai trò |
|---|---|---|
| `packages/core` | `@kinh-dich/core` | Lõi TypeScript thuần: bát quái, 64 quẻ, gieo quẻ, hỗ/biến/thác/tổng quái, Mai Hoa, ngũ hành. **Không** import React/DOM/RN. |
| `apps/web` | `@kinh-dich/web` | Vite + React 18. Test: Vitest + Testing Library (jsdom). Deploy: Vercel. |
| `apps/mobile` | `@kinh-dich/mobile` | Expo SDK 52 / React Native 0.76. Typecheck + bundle check. Deploy: EAS Workflows (`apps/mobile/.eas/workflows/`), runtimeVersion theo fingerprint. |

Core được dùng trực tiếp từ source (`main: src/index.ts`), không có bước build.

## Lệnh

```bash
npm install                 # cài toàn bộ workspace
npm run verify              # typecheck + test mọi workspace — PHẢI xanh trước khi kết thúc
npm run test -w @kinh-dich/core
npm run dev:web             # http://localhost:5173
npm run dev:mobile          # Expo
npm run build               # build web (apps/web/dist)
npm run bundle:check -w @kinh-dich/mobile   # bundle Android bằng Metro (kiểm tra resolve monorepo)
```

## Quy tắc

- **Logic Kinh Dịch chỉ đặt ở `packages/core`**, UI chỉ hiển thị. Tính năng mới: viết test trong `packages/core/test` trước.
- **Web và mobile phải song song**: mọi tính năng làm trên cả hai app trong cùng một thay đổi, cùng hành vi và cùng nội dung chữ. Chữ hiển thị dùng chung (giải thích, thuật ngữ, mô tả phương pháp, giới thiệu, tác giả) đặt trong `packages/core/src/content.ts`, `glossary.ts`, `explain.ts` — không viết cứng riêng ở một app. Cột Web/Mobile trong `docs/SPEC.md` phải khớp nhau.
- Logo gốc: `assets/brand/logo.svg`; sinh lại PNG bằng `node scripts/gen-icons.mjs` (cần Playwright).
- Mỗi tính năng trong `docs/SPEC.md` có mã (vd. `F-CAST-01`); ghi mã đó trong tên `describe`/`it` của test tương ứng.
- Hào luôn được đánh **từ dưới lên** (index 0 = hào sơ, 5 = hào thượng); khi vẽ thì đảo ngược (thượng ở trên).
- Bit `1` = dương, `0` = âm. Giá trị gieo: 6 lão âm (động), 7 thiếu dương, 8 thiếu âm, 9 lão dương (động).
- Khóa quẻ đơn dùng pinyin (`qian`=Càn, `gen`=Cấn…) để tránh trùng Càn/Cấn.
- Hàm ngẫu nhiên nhận `rng` tiêm vào; test dùng `seededRng(seed)` — không dùng `Math.random` trực tiếp trong test.
- Dữ liệu 64 quẻ (`hexagrams.ts`) là nguồn chân lý; mọi sửa đổi phải giữ test "64 tổ hợp duy nhất" và các quẻ mẫu.
- Văn bản hiển thị bằng tiếng Việt có dấu; tìm kiếm phải hỗ trợ không dấu.
- TypeScript strict + `noUncheckedIndexedAccess`; không dùng `any`, không `@ts-ignore`.

## Harness (`.claude/`)

- **Context**: file này + `docs/kinh-dich.md` (nạp tự động bên dưới). SessionStart hook tự `npm install` nếu thiếu và nạp trạng thái git.
- **Block** (PreToolUse `guard-bash`, `guard-files`): chặn force-push, push lên main/master, `rm -rf` thư mục gốc/home, hard reset, đọc `.env`, `--no-verify`, cập nhật snapshot để lách test, `npm publish`; chặn sửa `package-lock.json`, `.env`, cấu hình harness, và ghi đè file test làm giảm số test.
  Lưu ý: guard-bash so khớp cả nội dung lệnh, nên heredoc chứa các chuỗi trên cũng bị chặn — hãy ghi file bằng Write/Edit.
- **Test** (PostToolUse `post-edit-check`): sau mỗi lần sửa `.ts/.tsx` → typecheck workspace đó; sửa core → chạy test core + typecheck web/mobile. Lỗi trả về ngay để sửa.
- **Loop** (Stop `stop-verify`): nếu có thay đổi chưa commit mà `npm run verify` đỏ → chặn kết thúc, buộc tiếp tục sửa (tối đa 5 vòng, đổi bằng `KINH_DICH_MAX_STOP_LOOPS`). Hết vòng thì báo trung thực cho người dùng.
- Skill `/feature-loop` (quy trình TDD), `/verify`; subagent `iching-reviewer` (soát đúng nghiệp vụ), `test-writer`.

Không tự sửa `.claude/settings.json` hay `.claude/hooks/*` — đề xuất cho người dùng.
Không tự deploy production bằng token cá nhân; deploy đi qua GitHub Actions (`docs/DEPLOY.md`).

@docs/kinh-dich.md
