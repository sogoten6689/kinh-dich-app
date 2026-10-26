import { ABOUT, ELEMENT_NAMES, TRIGRAMS, TRIGRAM_ORDER, type Direction, type Trigram, type TrigramKey } from "@kinh-dich/core";
import { useState } from "react";
import { ELEMENT_COLOR } from "../elements";
import { WuxingCycle } from "./WuxingCycle";

type Arrangement = "late" | "early";

/** Góc (độ) của mỗi phương; bản đồ cổ đặt phương Nam ở trên cùng. */
const ANGLE: Readonly<Record<Direction, number>> = {
  Nam: -90,
  "Tây Nam": -45,
  Tây: 0,
  "Tây Bắc": 45,
  Bắc: 90,
  "Đông Bắc": 135,
  Đông: 180,
  "Đông Nam": -135,
};

const C = 170;
const R_TRIGRAM = 98;
const R_LABEL = 148;

/** Ba hào của quẻ đơn, hào dưới hướng vào tâm. */
function TrigramGlyph({ t, angle }: { t: Trigram; angle: number }) {
  const w = 44;
  const h = 6;
  const gap = 5;
  return (
    <g transform={`rotate(${angle + 90})`}>
      {t.lines.map((bit, i) => {
        const y = (1 - i) * (h + gap) - h / 2;
        return bit === 1 ? (
          <rect key={i} x={-w / 2} y={y} width={w} height={h} rx={1.5} />
        ) : (
          <g key={i}>
            <rect x={-w / 2} y={y} width={w / 2 - 4} height={h} rx={1.5} />
            <rect x={4} y={y} width={w / 2 - 4} height={h} rx={1.5} />
          </g>
        );
      })}
    </g>
  );
}

export function BaguaView() {
  const [arr, setArr] = useState<Arrangement>("late");
  const [selected, setSelected] = useState<TrigramKey>("qian");
  const t = TRIGRAMS[selected];
  const dir = (k: TrigramKey) => (arr === "late" ? TRIGRAMS[k].direction : TRIGRAMS[k].earlyHeavenDirection);

  return (
    <div className="bagua">
      <div className="library-head">
        <h2>Bát quái</h2>
        <p>{ABOUT.bagua}</p>
        <div className="segmented" role="radiogroup" aria-label="Cách sắp xếp">
          <button type="button" role="radio" aria-checked={arr === "late"} className={arr === "late" ? "active" : ""} onClick={() => setArr("late")}>
            Hậu Thiên (Văn Vương)
          </button>
          <button type="button" role="radio" aria-checked={arr === "early"} className={arr === "early" ? "active" : ""} onClick={() => setArr("early")}>
            Tiên Thiên (Phục Hy)
          </button>
        </div>
      </div>

      <div className="bagua-layout">
        <svg className="bagua-wheel" viewBox="0 0 340 340" role="group" aria-label={`Bát quái ${arr === "late" ? "Hậu Thiên" : "Tiên Thiên"}, phương Nam ở trên`}>
          <polygon
            className="octagon"
            points={Array.from({ length: 8 }, (_, i) => {
              const a = ((i * 45 - 22.5) * Math.PI) / 180;
              return `${C + 125 * Math.cos(a)},${C + 125 * Math.sin(a)}`;
            }).join(" ")}
          />
          {/* Thái cực ở tâm */}
          <g transform={`translate(${C} ${C})`} className="taiji">
            <circle r="34" className="yin-fill" />
            <path d="M0 -34 A34 34 0 0 1 0 34 A17 17 0 0 1 0 0 A17 17 0 0 0 0 -34 Z" className="yang-fill" />
            <circle cy="-17" r="5" className="yin-fill" />
            <circle cy="17" r="5" className="yang-fill" />
            <circle r="34" className="taiji-ring" />
          </g>
          {TRIGRAM_ORDER.map((k) => {
            const tr = TRIGRAMS[k];
            const a = ANGLE[dir(k)];
            const rad = (a * Math.PI) / 180;
            const gx = C + R_TRIGRAM * Math.cos(rad);
            const gy = C + R_TRIGRAM * Math.sin(rad);
            const lx = C + R_LABEL * Math.cos(rad);
            const ly = C + R_LABEL * Math.sin(rad);
            return (
              <g
                key={k}
                className={`bagua-item ${selected === k ? "on" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${tr.name} — ${tr.natureVi}, phương ${dir(k)}`}
                aria-pressed={selected === k}
                onClick={() => setSelected(k)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(k);
                  }
                }}
              >
                <circle cx={gx} cy={gy} r="30" className="hit" />
                <g transform={`translate(${gx} ${gy})`} style={{ fill: ELEMENT_COLOR[tr.element] }}>
                  <TrigramGlyph t={tr} angle={a} />
                </g>
                <text x={lx} y={ly - 2} textAnchor="middle" className="bagua-name">
                  {tr.name}
                </text>
                <text x={lx} y={ly + 12} textAnchor="middle" className="bagua-dir">
                  {dir(k)}
                </text>
              </g>
            );
          })}
        </svg>

        <article className="trigram-card" aria-live="polite" style={{ borderTopColor: ELEMENT_COLOR[t.element] }}>
          <div className="trigram-card-head">
            <span className="big-sym" style={{ color: ELEMENT_COLOR[t.element] }}>
              {t.symbol}
            </span>
            <div>
              <h3>
                {t.name} <span className="hanzi">{t.hanzi}</span>
              </h3>
              <p>
                {t.nature} — {t.natureVi}
              </p>
            </div>
          </div>
          <p>{t.description}</p>
          <dl>
            <dt>Tính chất</dt>
            <dd>{t.quality}</dd>
            <dt>Ngũ hành</dt>
            <dd>
              <span className="el-dot" style={{ background: ELEMENT_COLOR[t.element] }} /> {ELEMENT_NAMES[t.element]}
            </dd>
            <dt>Hậu Thiên</dt>
            <dd>{t.direction}</dd>
            <dt>Tiên Thiên</dt>
            <dd>
              {t.earlyHeavenDirection} · số {t.earlyHeavenNumber}
            </dd>
            <dt>Gia đình</dt>
            <dd>{t.family}</dd>
            <dt>Con vật</dt>
            <dd>{t.animal}</dd>
            <dt>Cơ thể</dt>
            <dd>{t.body}</dd>
          </dl>
        </article>
      </div>

      <section className="wuxing-section">
        <h3>Ngũ hành</h3>
        <p>{ABOUT.wuxing} Màu của các quẻ phía trên theo màu hành của chúng.</p>
        <WuxingCycle />
      </section>
    </div>
  );
}
