import type { BirthChart } from "@kinh-dich/core";

const CELL = 72;
const PAD = 14;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Tâm ô của chữ số d trên lưới 3-6-9 / 2-5-8 / 1-4-7. */
function center(d: number) {
  const col = Math.floor((d - 1) / 3);
  const row = 2 - ((d - 1) % 3);
  return { x: PAD + col * CELL + CELL / 2, y: PAD + row * CELL + CELL / 2 };
}

/** Biểu đồ ngày sinh: mỗi ô lặp lại chữ số theo số lần xuất hiện; mũi tên đầy là đường liền, mũi tên trống là đường đứt. */
export function BirthChartGrid({ chart }: { chart: BirthChart }) {
  const size = PAD * 2 + CELL * 3;
  const line = (digits: readonly number[], cls: string, key: string) => {
    const a = center(digits[0]!);
    const b = center(digits[2]!);
    const dx = (b.x - a.x) * 0.18;
    const dy = (b.y - a.y) * 0.18;
    return <line key={key} x1={a.x - dx} y1={a.y - dy} x2={b.x + dx} y2={b.y + dy} className={cls} />;
  };
  return (
    <svg className="birth-chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Biểu đồ ngày sinh">
      {DIGITS.map((d) => {
        const c = center(d);
        return (
          <g key={`c${d}`} className={chart.counts[d as 1] ? "bc-cell has" : "bc-cell"}>
            <rect x={c.x - CELL / 2 + 3} y={c.y - CELL / 2 + 3} width={CELL - 6} height={CELL - 6} rx={10} />
          </g>
        );
      })}
      {chart.emptyArrows.map((a) => line(a.digits, "bc-arrow empty", `e-${a.key}`))}
      {chart.arrows.map((a) => line(a.digits, "bc-arrow full", `f-${a.key}`))}
      {/* Chữ số vẽ sau cùng để không bị mũi tên che. */}
      {DIGITS.map((d) => {
        const c = center(d);
        const n = chart.counts[d as 1];
        return (
          <g key={`t${d}`} className={n ? "bc-cell has" : "bc-cell"}>
            <text x={c.x} y={c.y + 6} textAnchor="middle">
              {n ? String(d).repeat(Math.min(n, 4)) : d}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
