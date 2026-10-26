---
name: feature-loop
description: Vòng lặp agent để thêm/sửa tính năng Kinh Dịch theo TDD — đọc spec, viết test thất bại, cài đặt trong core, nối UI web + mobile, verify, review nghiệp vụ, commit. Dùng cho mọi yêu cầu tính năng mới hoặc sửa lỗi logic.
argument-hint: "<mã F-… hoặc mô tả tính năng>"
---

Tính năng: $ARGUMENTS

Lặp các bước sau cho đến khi đạt tiêu chí hoàn thành. Dùng TaskCreate để theo dõi từng bước.

1. **Context** — đọc `CLAUDE.md`, `docs/SPEC.md` (tìm mã tính năng; nếu chưa có thì thêm dòng mới với tiêu chí chấp nhận), `docs/kinh-dich.md`, và code liên quan trong `packages/core/src`. Quy tắc nghiệp vụ chưa có → bổ sung vào `docs/kinh-dich.md` kèm ví dụ tính tay.
2. **Test đỏ** — viết test trong `packages/core/test` mang mã `F-…` (hoặc giao subagent `test-writer`). Chạy `npm run test -w @kinh-dich/core`, xác nhận thất bại đúng lý do.
3. **Cài đặt** — sửa tối thiểu trong `packages/core/src`, export qua `src/index.ts`. PostToolUse hook báo lỗi typecheck/test ngay sau mỗi lần sửa — sửa luôn, đừng dồn lại.
4. **UI** — nối vào `apps/web/src` và `apps/mobile/src` (chỉ hiển thị, không tính toán). Thêm test UI web nếu có tương tác mới.
5. **Verify** — chạy skill `/verify`. Đỏ → quay lại bước 3 (Stop hook cũng chặn kết thúc khi đỏ).
6. **Review** — gọi subagent `iching-reviewer`. Có phát hiện → thêm test tái hiện, quay lại bước 3.
7. **Spec & commit** — cập nhật trạng thái ✅/🟡 trong `docs/SPEC.md`; commit nhỏ trên nhánh tính năng. Deploy diễn ra qua CI khi merge (không tự deploy).

Tiêu chí hoàn thành: test mới khóa hành vi, `npm run verify` xanh, reviewer không còn phát hiện, spec + tài liệu nghiệp vụ cập nhật.

Không được: xóa/skip test, nới tolerance cho qua, đặt logic trong UI, sửa harness.
