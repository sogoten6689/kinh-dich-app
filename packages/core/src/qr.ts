import qrcode from "qrcode-generator";

/**
 * Ma trận mã QR cho một chuỗi (true = ô tối), mức sửa lỗi M, tự chọn kích thước.
 * Web và mobile tự vẽ ma trận này (SVG / react-native-svg) nên hai nền tảng có cùng một mã.
 */
export function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(text, "Byte");
  qr.make();
  const n = qr.getModuleCount();
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)));
}

/** Đường vẽ SVG (một `<path>`) cho ma trận QR, mỗi ô tối là hình vuông 1×1, có lề `margin` ô. */
export function qrPath(matrix: readonly (readonly boolean[])[], margin = 2): { d: string; size: number } {
  let d = "";
  matrix.forEach((row, r) =>
    row.forEach((dark, c) => {
      if (dark) d += `M${c + margin} ${r + margin}h1v1h-1z`;
    }),
  );
  return { d, size: matrix.length + margin * 2 };
}

/** Kích thước hiển thị (px) gần `target` nhất mà mỗi ô là số pixel nguyên, để máy quét đọc rõ cạnh ô. */
export function qrPixelSize(modules: number, target: number): number {
  return Math.max(2, Math.floor(target / modules)) * modules;
}
