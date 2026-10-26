import { ELEMENT_NAMES, explainHexagram, invertedHexagram, nuclearHexagram, oppositeHexagram, type Hexagram } from "@kinh-dich/core";
import { useEffect, useRef } from "react";
import { ELEMENT_COLOR } from "../elements";
import { HexagramFigure } from "./HexagramFigure";
import { Term } from "./Term";

interface Props {
  hexagram: Hexagram;
  onSelect: (n: number) => void;
  onClose: () => void;
}

export function HexagramDetail({ hexagram: h, onSelect, onClose }: Props) {
  const e = explainHexagram(h);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [h.number]);
  const related = [
    { label: "Hỗ quái", term: "ho-quai", h: nuclearHexagram(h) },
    { label: "Thác quái", term: "thac-quai", h: oppositeHexagram(h) },
    { label: "Tổng quái", term: "tong-quai", h: invertedHexagram(h) },
  ];
  return (
    <article className="detail" ref={ref} aria-label={`Chi tiết quẻ ${h.number}`}>
      <button type="button" className="ghost close" onClick={onClose} aria-label="Đóng chi tiết quẻ">
        Đóng
      </button>
      <div className="detail-head">
        <HexagramFigure hexagram={h} size="lg" showTrigrams caption={false} />
        <div>
          <p className="eyebrow">Quẻ số {h.number}</p>
          <h2>
            {h.fullName} <span className="hanzi">{h.hanzi}</span>
          </h2>
          <p className="meaning-lg">{h.meaning}</p>
          <div className="trigram-pair">
            {[
              { pos: "Ngoại quái (trên)", t: h.upper },
              { pos: "Nội quái (dưới)", t: h.lower },
            ].map(({ pos, t }) => (
              <div key={pos} className="trigram-chip" style={{ borderColor: ELEMENT_COLOR[t.element] }}>
                <span className="sym">{t.symbol}</span>
                <span>
                  <small>{pos}</small>
                  <strong>
                    {t.name} — {t.natureVi}
                  </strong>
                  <small>
                    Hành {ELEMENT_NAMES[t.element]} · {t.quality}
                  </small>
                </span>
              </div>
            ))}
          </div>
          <p>{e.relation}</p>
        </div>
      </div>

      <h3>Sáu hào</h3>
      <div className="line-table-wrap">
        <table className="line-table">
          <thead>
            <tr>
              <th>Hào</th>
              <th>Tên</th>
              <th>Vị trí nói lên điều gì</th>
              <th>
                <Term k="dac-chinh">Chính</Term> / <Term k="dac-trung">Trung</Term>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...e.lines].reverse().map((l) => (
              <tr key={l.position}>
                <td>
                  <span className={`mini-line ${l.yang ? "yang" : "yin"}`}>
                    <span />
                    {!l.yang && <span />}
                  </span>
                </td>
                <td>
                  <strong>{l.label}</strong>
                </td>
                <td>{l.role}</td>
                <td>
                  <span className={`badge ${l.correct ? "good" : "off"}`}>{l.correct ? "Đắc chính" : "Thất chính"}</span>
                  {l.central && <span className="badge good">Đắc trung</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Quẻ liên quan</h3>
      <div className="related">
        {related.map((r) => (
          <div key={r.label} className="related-item">
            <Term k={r.term}>{r.label}</Term>
            <HexagramFigure hexagram={r.h} size="sm" onSelect={() => onSelect(r.h.number)} />
          </div>
        ))}
      </div>
    </article>
  );
}
