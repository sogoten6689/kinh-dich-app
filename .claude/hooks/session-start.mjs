// SessionStart: đảm bảo phụ thuộc đã cài và nạp trạng thái dự án vào context.
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, run, tail } from "./lib.mjs";

const lines = [];
if (!existsSync(path.join(ROOT, "node_modules"))) {
  const r = run("npm", ["install", "--no-audit", "--no-fund"], { timeout: 600_000 });
  lines.push(r.ok ? "Đã chạy npm install." : `npm install lỗi:\n${tail(r.output, 20)}`);
}
const branch = run("git", ["branch", "--show-current"]).output.trim();
const gitLog = run("git", ["log", "--oneline", "-5"]);
const log = gitLog.ok ? gitLog.output.trim() : "";
const status = run("git", ["status", "--short"]).output.trim();
lines.push(`Nhánh: ${branch || "(chưa có)"}`);
if (log) lines.push(`Commit gần nhất:\n${log}`);
lines.push(status ? `Thay đổi chưa commit:\n${tail(status, 20)}` : "Cây làm việc sạch.");
lines.push("Nhắc: chạy `npm run verify` trước khi kết thúc; Stop hook sẽ chặn nếu verify đỏ.");

console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: lines.join("\n") } }));
