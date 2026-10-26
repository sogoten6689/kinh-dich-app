// PostToolUse(Edit|Write|MultiEdit): typecheck workspace vừa sửa; với core thì chạy luôn unit test.
// Lỗi được trả về cho Claude (exit 2) để sửa ngay trong vòng lặp.
import { readInput, run, tail, workspaceOf } from "./lib.mjs";

const file = String(readInput().tool_input?.file_path ?? "");
if (!/\.(ts|tsx)$/.test(file)) process.exit(0);
const ws = workspaceOf(file);
if (!ws) process.exit(0);

const tsc = run("npm", ["run", "typecheck", "-w", ws, "--silent"], { timeout: 120_000 });
if (!tsc.ok) {
  process.stderr.write(`Typecheck ${ws} lỗi sau khi sửa ${file}:\n${tail(tsc.output, 40)}\n`);
  process.exit(2);
}
// Core là nơi chứa logic Kinh Dịch — test chạy < 2s nên chạy mỗi lần sửa.
// Core còn được web/mobile dùng, nên typecheck cả hai app.
if (ws === "packages/core") {
  const t = run("npm", ["run", "test", "-w", ws, "--silent"], { timeout: 120_000 });
  if (!t.ok) {
    process.stderr.write(`Unit test core lỗi sau khi sửa ${file}:\n${tail(t.output, 50)}\n`);
    process.exit(2);
  }
  for (const app of ["apps/web", "apps/mobile"]) {
    const r = run("npm", ["run", "typecheck", "-w", app, "--silent"], { timeout: 120_000 });
    if (!r.ok) {
      process.stderr.write(`Thay đổi core làm vỡ typecheck ${app}:\n${tail(r.output, 40)}\n`);
      process.exit(2);
    }
  }
}
process.exit(0);
