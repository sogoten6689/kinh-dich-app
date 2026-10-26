// PreToolUse(Bash): chặn lệnh nguy hiểm / ngoài quy trình.
import { block, readInput } from "./lib.mjs";

const cmd = String(readInput().tool_input?.command ?? "");

const rules = [
  [/\brm\s+(-[a-zA-Z]*[rf][a-zA-Z]*\s+)+(\/|~|\$HOME|\.\.?)(\s|\/?$|\/\*)/, "Không xóa đệ quy thư mục gốc / home / thư mục cha."],
  [/\bgit\s+push\b[^|;&]*(--force\b|-f\b|--force-with-lease\b)/, "Không force-push. Dùng commit mới hoặc hỏi người dùng."],
  [/\bgit\s+push\b[^|;&]*[\s:](main|master)(\s|$)/, "Không push thẳng lên main/master — làm việc trên nhánh tính năng."],
  [/\bgit\s+reset\s+--hard\b/, "Không `git reset --hard` (mất thay đổi). Dùng `git stash` nếu cần."],
  [/\bgit\s+(clean\s+-[a-zA-Z]*f|checkout\s+--\s+\.)/, "Không xóa/hủy thay đổi chưa commit hàng loạt."],
  [/--no-verify\b/, "Không bỏ qua git hooks (--no-verify)."],
  [/\bnpm\s+publish\b/, "Không publish package."],
  [/\b(curl|wget)\b[^|]*\|\s*(ba|z)?sh\b/, "Không chạy script tải từ mạng qua pipe vào shell."],
  [/(^|[\s;&|])(cat|less|head|tail|source|\.)\s+[^|;&]*\.env(\.[\w-]+)?(\s|$)/, "Không đọc file .env (bí mật)."],
  [/\b(vitest|jest)\b[^|;&]*(--passWithNoTests|-u\b|--update)/, "Không cập nhật snapshot/bỏ qua test để cho qua — sửa code."],
];

for (const [re, reason] of rules) {
  if (re.test(cmd)) block(`${reason}\nLệnh: ${cmd}`);
}
process.exit(0);
