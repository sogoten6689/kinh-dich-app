import type { Hexagram, LinePosition } from "@kinh-dich/core";
import type { CSSProperties } from "react";

interface Props {
  hexagram: Hexagram;
  changingLines?: readonly LinePosition[];
  title?: string;
  size?: "sm" | "md" | "lg";
  /** Hiện ngoặc thượng/hạ quái bên cạnh hình quẻ. */
  showTrigrams?: boolean;
  /** Hiện tên quẻ bên dưới. */
  caption?: boolean;
  /** Hiện ký hiệu ○/× trên hào động (chỉ đúng với quẻ chủ). */
  marks?: boolean;
  onSelect?: () => void;
}

/** Vẽ quẻ: hào thượng ở trên cùng, hào sơ ở dưới cùng; hào hiện dần từ dưới lên. */
export function HexagramFigure({ hexagram, changingLines = [], title, size = "md", showTrigrams = false, caption = true, marks = true, onSelect }: Props) {
  const rows = hexagram.lines.map((bit, i) => ({ bit, pos: (i + 1) as LinePosition })).reverse();
  const body = (
    <>
      {title && <span className="hexagram-title">{title}</span>}
      <div className="figure-row">
        <div className="lines">
          {rows.map(({ bit, pos }) => {
            const changing = changingLines.includes(pos);
            return (
              <div
                key={pos}
                data-testid={`line-${pos}`}
                className={`line ${bit === 1 ? "yang" : "yin"} ${changing ? "changing" : ""}`}
                style={{ "--i": pos - 1 } as CSSProperties}
                title={`Hào ${pos}${changing ? " (động)" : ""}`}
              >
                <span />
                {bit === 0 && <span />}
                {changing && marks && <em className="mark">{bit === 1 ? "○" : "×"}</em>}
              </div>
            );
          })}
        </div>
        {showTrigrams && (
          <div className="trigram-brackets" aria-hidden="true">
            <span>
              {hexagram.upper.symbol} {hexagram.upper.name}
              <small>{hexagram.upper.natureVi}</small>
            </span>
            <span>
              {hexagram.lower.symbol} {hexagram.lower.name}
              <small>{hexagram.lower.natureVi}</small>
            </span>
          </div>
        )}
      </div>
      {caption && (
        <span className="hexagram-caption">
          <strong>
            {hexagram.number}. {hexagram.fullName}
          </strong>
          <span className="hanzi">{hexagram.hanzi}</span>
          <span className="meaning">{hexagram.meaning}</span>
        </span>
      )}
    </>
  );
  const className = `hexagram size-${size}`;
  const label = `Quẻ ${hexagram.number} ${hexagram.fullName}`;
  return onSelect ? (
    <button type="button" className={`${className} selectable`} aria-label={label} onClick={onSelect}>
      {body}
    </button>
  ) : (
    <figure className={className} aria-label={label}>
      {body}
    </figure>
  );
}
