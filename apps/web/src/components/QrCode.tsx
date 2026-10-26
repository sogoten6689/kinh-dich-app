import { qrMatrix, qrPath, qrPixelSize } from "@kinh-dich/core";
import { useMemo } from "react";

/** Mã QR vẽ bằng SVG từ ma trận của core; nền trắng cố định để quét được cả ở giao diện tối. */
export function QrCode({ value, size: target = 200, label }: { value: string; size?: number; label: string }) {
  const { d, size: n } = useMemo(() => qrPath(qrMatrix(value)), [value]);
  const size = qrPixelSize(n, target);
  return (
    <svg className="qr" width={size} height={size} viewBox={`0 0 ${n} ${n}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#ffffff" />
      <path d={d} fill="#1d1712" />
    </svg>
  );
}
