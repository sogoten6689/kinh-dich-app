import { ELEMENT_NAMES, generates, overcomes, type Element } from "@kinh-dich/core";
import { ELEMENT_COLOR } from "../elements";

/** Thứ tự theo chiều kim đồng hồ, bắt đầu từ trên cùng: đi quanh vòng tròn là tương sinh. */
const ORDER: readonly Element[] = ["hoa", "tho", "kim", "thuy", "moc"];
const CX = 150;
const CY = 150;
const R = 92;
const NODE = 27;

function pos(e: Element, r = R) {
  const i = ORDER.indexOf(e);
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function edge(from: Element, to: Element) {
  const a = pos(from);
  const b = pos(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return { x1: a.x + ux * NODE, y1: a.y + uy * NODE, x2: b.x - ux * (NODE + 4), y2: b.y - uy * (NODE + 4) };
}

interface Props {
  ti?: Element;
  yong?: Element;
}

/** Vòng ngũ hành: cung ngoài là tương sinh, ngôi sao bên trong là tương khắc. Tô đậm quan hệ Thể – Dụng. */
export function WuxingCycle({ ti, yong }: Props) {
  const pairs = ORDER.flatMap((a) => ORDER.filter((b) => generates(a, b) || overcomes(a, b)).map((b) => [a, b] as const));
  const isActive = (a: Element, b: Element) => ti !== undefined && yong !== undefined && ((a === ti && b === yong) || (a === yong && b === ti));
  return (
    <figure className="wuxing">
      <svg viewBox="0 0 300 290" role="img" aria-label="Vòng tương sinh tương khắc của ngũ hành">
        <defs>
          <marker id="wx-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="wx-head" />
          </marker>
          <marker id="wx-arrow-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="wx-head-on" />
          </marker>
        </defs>
        {pairs.map(([a, b]) => {
          const on = isActive(a, b);
          const kind = generates(a, b) ? "gen" : "ovr";
          return (
            <line
              key={`${a}-${b}`}
              {...edge(a, b)}
              className={`wx-edge ${kind} ${on ? "on" : ""}`}
              markerEnd={on ? "url(#wx-arrow-on)" : "url(#wx-arrow)"}
            />
          );
        })}
        {ORDER.map((e) => {
          const p = pos(e);
          const lp = pos(e, R + NODE + 16);
          const role = e === ti && e === yong ? "Thể · Dụng" : e === ti ? "Thể" : e === yong ? "Dụng" : "";
          return (
            <g key={e} className={role ? "wx-node on" : "wx-node"}>
              <circle cx={p.x} cy={p.y} r={NODE} style={{ fill: ELEMENT_COLOR[e] }} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" className="wx-label">
                {ELEMENT_NAMES[e]}
              </text>
              {role && (
                <text x={lp.x} y={lp.y + 4} textAnchor="middle" className="wx-role">
                  {role}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>
        <span className="wx-key gen">Tương sinh</span>
        <span className="wx-key ovr">Tương khắc</span>
      </figcaption>
    </figure>
  );
}
