import { describe, expect, it } from "vitest";
import { APP_INFO, qrMatrix, qrPath, qrPixelSize } from "../src";

describe("F-ABOUT-04 mã QR tải app", () => {
  it("ma trận vuông, kích thước hợp lệ (21 + 4k)", () => {
    const m = qrMatrix(APP_INFO.androidDownload);
    expect(m.length).toBeGreaterThanOrEqual(21);
    expect((m.length - 21) % 4).toBe(0);
    for (const row of m) expect(row).toHaveLength(m.length);
  });

  it("có ba ô định vị ở các góc", () => {
    const m = qrMatrix("https://kinhdich-app.vercel.app");
    const n = m.length;
    // Góc ngoài của ô định vị luôn tối, ô ngay bên trong viền luôn sáng.
    for (const [r, c] of [
      [0, 0],
      [0, n - 1],
      [n - 1, 0],
    ] as const) {
      expect(m[r]![c]).toBe(true);
    }
    expect(m[1]![1]).toBe(false);
    expect(m[3]![3]).toBe(true);
  });

  it("cùng nội dung cho cùng ma trận, khác nội dung cho khác ma trận", () => {
    expect(qrMatrix("abc")).toEqual(qrMatrix("abc"));
    expect(qrMatrix("abc")).not.toEqual(qrMatrix("abd"));
  });
});

describe("F-ABOUT-04 đường vẽ QR", () => {
  it("một ô vuông cho mỗi ô tối, kích thước gồm lề", () => {
    const { d, size } = qrPath([
      [true, false],
      [false, true],
    ]);
    expect(size).toBe(6);
    expect(d).toBe("M2 2h1v1h-1zM3 3h1v1h-1z");
  });
});

describe("F-ABOUT-04 kích thước QR", () => {
  it("mỗi ô là số pixel nguyên, không nhỏ hơn 2px", () => {
    expect(qrPixelSize(53, 200)).toBe(159);
    expect(qrPixelSize(53, 212)).toBe(212);
    expect(qrPixelSize(53, 50)).toBe(106);
  });
});
