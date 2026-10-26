// Stop: cổng chất lượng của vòng lặp agent.
// Nếu có thay đổi mã nguồn chưa commit mà `npm run verify` đỏ → chặn dừng (decision: block)
// để Claude tiếp tục sửa. Giới hạn số vòng để không lặp vô hạn.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { readInput, ROOT, run, tail } from "./lib.mjs";

const MAX_ATTEMPTS = Number(process.env.KINH_DICH_MAX_STOP_LOOPS ?? 5);
const stateDir = path.join(ROOT, ".claude/state");
const counterFile = path.join(stateDir, "stop-attempts");

const input = readInput();
const status = run("git", ["status", "--porcelain", "--", "packages", "apps", "package.json", "tsconfig.base.json"]);
const dirty = status.ok && status.output.trim().length > 0;
if (!dirty) {
  rmSync(counterFile, { force: true });
  process.exit(0);
}

const verify = run("npm", ["run", "verify", "--silent"], { timeout: 600_000 });
if (verify.ok) {
  rmSync(counterFile, { force: true });
  process.exit(0);
}

const attempts = (existsSync(counterFile) ? Number(readFileSync(counterFile, "utf8")) || 0 : 0) + 1;
if (attempts > MAX_ATTEMPTS) {
  rmSync(counterFile, { force: true });
  // Cho phép dừng nhưng nhắc Claude báo trung thực cho người dùng.
  console.log(
    JSON.stringify({
      systemMessage: `Harness: verify vẫn đỏ sau ${MAX_ATTEMPTS} vòng sửa — dừng vòng lặp. Hãy báo lỗi cho người dùng.`,
    }),
  );
  process.exit(0);
}
mkdirSync(stateDir, { recursive: true });
writeFileSync(counterFile, String(attempts));

console.log(
  JSON.stringify({
    decision: "block",
    reason:
      `Vòng ${attempts}/${MAX_ATTEMPTS}: \`npm run verify\` thất bại với thay đổi chưa commit` +
      (input.stop_hook_active ? " (vẫn đỏ sau lần sửa trước)" : "") +
      `. Sửa nguyên nhân gốc (không xóa/skip test), rồi kết thúc lại.\n\n${tail(verify.output, 60)}`,
  }),
);
process.exit(0);
