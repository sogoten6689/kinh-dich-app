import { qrMatrix, qrPath, qrPixelSize } from "@kinh-dich/core";
import { useMemo } from "react";
import Svg, { Path, Rect } from "react-native-svg";

/** Cùng ma trận với apps/web/src/components/QrCode.tsx; nền trắng cố định để quét được. */
export function QrCode({ value, size: target = 200, label }: { value: string; size?: number; label: string }) {
  const { d, size: n } = useMemo(() => qrPath(qrMatrix(value)), [value]);
  const size = qrPixelSize(n, target);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} accessibilityLabel={label}>
      <Rect width={n} height={n} fill="#ffffff" />
      <Path d={d} fill="#1d1712" />
    </Svg>
  );
}
