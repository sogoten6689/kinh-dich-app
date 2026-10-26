// Sinh icon PNG cho web và mobile từ assets/brand/logo.svg.
// Cần Playwright + Chromium: `node scripts/gen-icons.mjs`
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// require() để dùng được cả Playwright cài global.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = readFileSync(path.join(root, "assets/brand/logo.svg"), "utf8");
// Adaptive icon Android: chỉ ba hào màu kem trên nền trong suốt (nền son đặt trong app.config).
const foreground = logo.replace(/<rect width="64"[^>]*\/>/, "").replace(/<rect x="5"[^>]*\/>/, "");

const targets = [
  { file: "apps/mobile/assets/icon.png", svg: logo, size: 1024, pad: 0, bg: "#a3361f" },
  { file: "apps/mobile/assets/adaptive-icon.png", svg: foreground, size: 1024, pad: 0.22, bg: "transparent" },
  { file: "apps/mobile/assets/splash-icon.png", svg: logo, size: 512, pad: 0, bg: "transparent" },
  { file: "apps/mobile/assets/favicon.png", svg: logo, size: 48, pad: 0, bg: "transparent" },
  { file: "apps/web/public/apple-touch-icon.png", svg: logo, size: 180, pad: 0, bg: "#a3361f" },
  { file: "apps/web/public/icon-512.png", svg: logo, size: 512, pad: 0, bg: "transparent" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const t of targets) {
  const inner = Math.round(t.size * (1 - 2 * t.pad));
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(
    `<html><body style="margin:0;background:${t.bg};display:grid;place-items:center;width:${t.size}px;height:${t.size}px">` +
      `<div style="width:${inner}px;height:${inner}px">${t.svg.replace("<svg ", '<svg width="100%" height="100%" ')}</div></body></html>`,
  );
  writeFileSync(path.join(root, t.file), await page.screenshot({ omitBackground: t.bg === "transparent" }));
  console.log("✓", t.file);
}
await browser.close();
copyFileSync(path.join(root, "assets/brand/logo.svg"), path.join(root, "apps/web/public/favicon.svg"));
console.log("✓ apps/web/public/favicon.svg");
