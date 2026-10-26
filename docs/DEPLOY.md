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

Ứng dụng chính thức (production): **https://kinhdich-app.vercel.app**. Trang Giới thiệu hiện môi trường Vercel và commit đã deploy (`VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`, nhúng lúc build qua `apps/web/vite.config.ts`).

**Cách A (đơn giản nhất): Vercel Git Integration**
1. vercel.com → *Add New Project* → import repo `kinh-dich-app`.
2. Root Directory: để trống (gốc repo, dùng `vercel.json` ở gốc) **hoặc** `apps/web` (dùng `apps/web/vercel.json`).
   Cả hai file đã đặt install/build/output và ghi đè cài đặt trên dashboard — không cần chỉnh Build/Output Directory trong Project Settings.
   Nếu gặp `STATIC_BUILD_NO_OUT_DIR`: kiểm tra Root Directory là một trong hai giá trị trên.
3. Deploy. Khi dùng cách này thì không cần secrets cho `deploy-web.yml` (workflow sẽ tự bỏ qua).

**Cách B: deploy qua GitHub Actions**
1. Cài CLI và liên kết: `npx vercel login && npx vercel link` ở gốc repo → tạo `.vercel/project.json` (chứa `orgId`, `projectId`; không commit).
2. Tạo token: vercel.com/account/tokens.
3. GitHub → Settings → Secrets and variables → Actions → thêm secrets:
   `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
4. Tắt Git Integration của Vercel cho project này (tránh deploy hai lần).

Deploy tay từ máy: `npx vercel` (preview) / `npx vercel --prod`.

## Mobile — Expo EAS (build trên máy chủ Expo)

Project EAS: `c946102a-7cad-4886-9743-b9c29f7048cb` (đã có trong `apps/mobile/app.config.ts`).
Project trên expo.dev là **`@sogoten6689/kinh-dich-app`**, nên `app.config.ts` đặt `slug: "kinh-dich-app"` và `owner: "sogoten6689"`. Nếu đổi project, phải đổi cả hai cho khớp, nếu không build sẽ dừng ở bước đọc cấu hình.

**Build APK (cài thẳng lên Android):**
```bash
npm run eas:build:android:apk      # từ gốc repo; tương đương `cd apps/mobile && eas build -p android --profile apk`
```
Profile `apk` = cấu hình `production` (kênh update `production`) nhưng xuất `.apk` và phân phối nội bộ (link tải). Workflow `production.yml` trên `main` cũng build profile này.

### 1. Kết nối (làm một lần)

> Mọi lệnh `eas …` phải chạy trong `apps/mobile` (hoặc dùng script ở gốc repo: `npm run eas:build:android:dev`, `npm run eas:build:ios:dev`, `npm run eas:build:android:preview`).
> Chạy ở gốc repo sẽ gặp `Failed to read "/eas.json"` — **đừng** chạy `eas build:configure` ở gốc. Build từ GitHub trên expo.dev cũng gặp lỗi này nếu chưa đặt *Base directory* = `apps/mobile`.

1. **Đăng nhập và kiểm tra project** (trên máy bạn):
   ```bash
   npm install -g eas-cli
   cd apps/mobile
   eas login
   eas init --id c946102a-7cad-4886-9743-b9c29f7048cb   # báo lỗi nếu slug "kinh-dich" không khớp
   ```
   Nếu project thuộc một organization trên Expo: vào expo.dev → project → *Environment variables*, thêm `EXPO_OWNER` = tên organization (dùng cho mọi môi trường).
2. **Kết nối GitHub với project**: expo.dev → project *kinh-dich* → *Project settings* → *GitHub* → *Connect* → cài Expo GitHub App cho repo `sogoten6689/kinh-dich-app`.
   - **Base directory**: `apps/mobile` (bắt buộc vì repo là monorepo).
3. **Khóa ký app lần đầu**: chạy một lần trên máy để EAS tạo và lưu keystore Android (máy chủ không trả lời được câu hỏi tương tác):
   ```bash
   eas build --platform android --profile preview
   ```
   iOS (cần Apple Developer): `eas build --platform ios --profile preview` hoặc `eas credentials`, sau đó đăng ký máy bằng `eas device:create`.
4. **Kiểm tra file workflow** (cần đăng nhập): `eas workflow:validate .eas/workflows/preview.yml` (tương tự cho `production.yml`, `build-all.yml`).

### 2. Build tự động (EAS Workflows, file trong `apps/mobile/.eas/workflows/`)

| File | Khi nào chạy | Làm gì |
|---|---|---|
| `preview.yml` | Mở/cập nhật PR vào `main` | Tính fingerprint. Native không đổi → EAS Update kênh `preview`. Native đổi → build APK `preview` mới |
| `production.yml` | Push/merge vào `main` | Như trên với profile `apk` (APK cấu hình production) và kênh `production` |
| `build-all.yml` | Chạy tay | Build `preview` cho Android và iOS |

Chạy tay: expo.dev → project → *Workflows* → chọn workflow → *Run*, hoặc
```bash
cd apps/mobile
eas workflow:run build-all.yml --ref main
```
Xem kết quả: expo.dev → *Workflows* / *Builds*, hoặc `eas workflow:runs`.

`runtimeVersion` dùng chính sách **fingerprint**: khi thêm thư viện native hay đổi cấu hình native, fingerprint đổi → workflow tự build bản mới; khi chỉ sửa JS/TS → chỉ đẩy update. Không cần tự tăng `version` để tránh update lệch.

iOS tự động: sau khi chứng chỉ Apple đã có, chép các job `get_android_build` / `build_android` / `publish_android_update` trong `preview.yml`, `production.yml` thành bản `platform: ios` (fingerprint dùng `ios_fingerprint_hash`).

### 3. Cài và cập nhật

- APK preview: mở link build trên expo.dev bằng điện thoại Android → *Install* (bật cài ứng dụng không rõ nguồn gốc nếu được hỏi).
- iPhone: mở link build trên máy đã đăng ký UDID → *Install*.
- Bản cập nhật OTA: tắt hẳn app rồi mở lại; app tải bản mới và áp dụng ở lần mở tiếp theo.

### 4. Lên store

```bash
eas build --platform all --profile production
eas submit --platform android   # cần JSON service account Google Play; lần đầu tải .aab lên Play Console bằng tay
eas submit --platform ios       # cần Apple ID / App Store Connect
```
Có thể tự động hóa bằng job `type: submit` trong `production.yml` sau khi đã cấu hình store.

### 5. Đường dự phòng: GitHub Actions

`.github/workflows/deploy-mobile.yml` giờ chỉ chạy tay (Actions → *Deploy mobile (Expo EAS)* → *Run workflow*), cần secret `EXPO_TOKEN`. Dùng khi chưa kết nối GitHub trong expo.dev.

Thử nhanh không cần build: `npm run dev:mobile` (Expo Go — chỉ khi Expo Go hỗ trợ SDK 52) hoặc `npm run web -w @kinh-dich/mobile` để xem trên trình duyệt.
