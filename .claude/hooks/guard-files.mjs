// PreToolUse(Edit|Write|MultiEdit): bảo vệ file không được sửa tay.
import path from "node:path";
import { block, readInput, ROOT } from "./lib.mjs";

const input = readInput();
const file = String(input.tool_input?.file_path ?? "");
const rel = path.relative(ROOT, path.resolve(ROOT, file)).split(path.sep).join("/");

if (/(^|\/)\.env(\.|$)/.test(rel) && !rel.endsWith(".env.example")) block(`Không sửa file bí mật ${rel}.`);
if (/(^|\/)package-lock\.json$/.test(rel)) block("package-lock.json chỉ được sinh bởi `npm install`, không sửa tay.");
if (/(^|\/)node_modules\//.test(rel) || rel.startsWith(".git/")) block(`Không sửa ${rel}.`);
if (rel === ".claude/settings.json" || rel.startsWith(".claude/hooks/")) {
  // Agent không được tự nới lỏng harness của chính nó.
  block(`${rel} là cấu hình harness — chỉ người dùng được thay đổi. Hãy đề xuất thay đổi trong câu trả lời.`);
}

// Không cho xóa/giảm test: Write ghi đè file test với ít test hơn.
if (input.tool_name === "Write" && /\.test\.tsx?$/.test(rel)) {
  const { existsSync, readFileSync } = await import("node:fs");
  const abs = path.resolve(ROOT, rel);
  if (existsSync(abs)) {
    const count = (s) => (s.match(/\b(it|test)(\.each\([\s\S]*?\))?\s*\(/g) ?? []).length;
    const before = count(readFileSync(abs, "utf8"));
    const after = count(String(input.tool_input?.content ?? ""));
    if (after < before) block(`Ghi đè ${rel} làm giảm số test (${before} → ${after}). Không xóa test để cho qua; dùng Edit nếu chỉ sửa.`);
  }
}
process.exit(0);
