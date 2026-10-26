# Deploy

| | Web | Mobile |
|---|---|---|
| Dịch vụ | Vercel | Expo EAS (Update + Build) |
| Cấu hình | `vercel.json` | `apps/mobile/app.config.ts`, `apps/mobile/eas.json` |
| Workflow | `.github/workflows/deploy-web.yml` | `.github/workflows/deploy-mobile.yml` |
| PR | Preview URL | EAS Update kênh `preview` |
| Push `main` | Production | EAS Update kênh `production` |

Cả hai workflow **tự bỏ qua** (chỉ in notice) khi chưa có secrets, nên CI không đỏ trước khi bạn cấu hình.

## Web — Vercel

**Cách A (đơn giản nhất): Vercel Git Integration**
1. vercel.com → *Add New Project* → import repo `kinh-dich-app`.
2. Root Directory: để trống (gốc repo). `vercel.json` đã đặt install/build/output (`apps/web/dist`).
3. Deploy. Khi dùng cách này thì không cần secrets cho `deploy-web.yml` (workflow sẽ tự bỏ qua).

**Cách B: deploy qua GitHub Actions**
1. Cài CLI và liên kết: `npx vercel login && npx vercel link` ở gốc repo → tạo `.vercel/project.json` (chứa `orgId`, `projectId`; không commit).
2. Tạo token: vercel.com/account/tokens.
3. GitHub → Settings → Secrets and variables → Actions → thêm secrets:
   `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
4. Tắt Git Integration của Vercel cho project này (tránh deploy hai lần).

Deploy tay từ máy: `npx vercel` (preview) / `npx vercel --prod`.

## Mobile — Expo EAS

1. Tạo tài khoản expo.dev, rồi ở `apps/mobile`:
   ```bash
   npx eas-cli login
   npx eas-cli init          # tạo project, in ra projectId
   ```
2. GitHub → Settings → Secrets and variables → Actions:
   - Secret `EXPO_TOKEN` (expo.dev → Account settings → Access tokens).
   - Variable `EAS_PROJECT_ID` = projectId ở bước 1.
   - Variable `EXPO_OWNER` = username/organization Expo (nếu project thuộc organization).
3. Bản cài đặt đầu tiên (OTA chỉ áp dụng cho app đã cài có cùng `runtimeVersion`):
   - Actions → *Deploy mobile (Expo EAS)* → *Run workflow* → `build = true`, chọn nền tảng.
   - Hoặc từ máy: `EAS_PROJECT_ID=<id> npx eas-cli build --profile preview --platform android`.
   - iOS cần tài khoản Apple Developer; EAS sẽ hỏi credentials ở lần build đầu (chạy tay từ máy).
4. Sau đó mỗi PR / push `main` sẽ đẩy EAS Update lên kênh tương ứng.
5. Lên store: `npx eas-cli build --profile production` rồi `npx eas-cli submit`.

Thử nhanh không cần build: `npm run dev:mobile` rồi quét QR bằng Expo Go (SDK 52).

`runtimeVersion` theo `version` trong `app.config.ts`: khi thêm thư viện native, tăng `version` và build lại.
