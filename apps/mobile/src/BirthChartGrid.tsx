import type { BirthChart } from "@kinh-dich/core";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "./theme";

/** Cùng hình học với apps/web/src/components/BirthChartGrid.tsx. */
const CELL = 72;
const PAD = 14;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function center(d: number) {
  const col = Math.floor((d - 1) / 3);
  const row = 2 - ((d - 1) % 3);
  return { x: PAD + col * CELL + CELL / 2, y: PAD + row * CELL + CELL / 2 };
}

export function BirthChartGrid({ chart, size = 240 }: { chart: BirthChart; size?: number }) {
  const box = PAD * 2 + CELL * 3;
  const line = (digits: readonly number[], full: boolean, key: string) => {
    const a = center(digits[0]!);
    const b = center(digits[2]!);
    const dx = (b.x - a.x) * 0.18;
    const dy = (b.y - a.y) * 0.18;
    return (
      <Line
        key={key}
        x1={a.x - dx}
        y1={a.y - dy}
        x2={b.x + dx}
        y2={b.y + dy}
        stroke={full ? colors.accent : colors.muted}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={full ? undefined : "6 7"}
        opacity={full ? 0.75 : 0.55}
      />
    );
  };
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} accessibilityLabel="Biểu đồ ngày sinh">
      {DIGITS.map((d) => {
        const c = center(d);
        const has = chart.counts[d] > 0;
        return (
          <Rect
            key={`c${d}`}
            x={c.x - CELL / 2 + 3}
            y={c.y - CELL / 2 + 3}
            width={CELL - 6}
            height={CELL - 6}
            rx={10}
            fill={has ? colors.card : colors.surface}
            stroke={has ? colors.accent : colors.line}
          />
        );
      })}
      {chart.emptyArrows.map((a) => line(a.digits, false, `e-${a.key}`))}
      {chart.arrows.map((a) => line(a.digits, true, `f-${a.key}`))}
      {DIGITS.map((d) => {
        const c = center(d);
        const n = chart.counts[d];
        return (
          <G key={`t${d}`}>
            <SvgText x={c.x} y={c.y + 6} textAnchor="middle" fontSize="18" fontWeight="600" fill={n ? colors.fg : colors.line}>
              {n ? String(d).repeat(Math.min(n, 4)) : String(d)}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
