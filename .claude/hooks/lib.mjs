// Tiện ích dùng chung cho các hook của Claude Code.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Đọc JSON hook input từ stdin. */
export function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

/** Chặn tool call: exit 2, stderr được gửi lại cho Claude. */
export function block(reason) {
  process.stderr.write(`⛔ Harness chặn: ${reason}\n`);
  process.exit(2);
}

export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", timeout: opts.timeout ?? 300_000, env: process.env });
  return { ok: r.status === 0, output: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

/** Giữ N dòng cuối để không làm tràn context. */
export function tail(text, lines = 60) {
  const all = text.trimEnd().split("\n");
  return (all.length > lines ? ["…(đã cắt bớt)", ...all.slice(-lines)] : all).join("\n");
}

/** Workspace chứa file (packages/core, apps/web, apps/mobile) hoặc null. */
export function workspaceOf(file) {
  const rel = path.relative(ROOT, path.resolve(ROOT, file)).split(path.sep).join("/");
  const m = rel.match(/^(packages|apps)\/([^/]+)\//);
  return m ? `${m[1]}/${m[2]}` : null;
}
