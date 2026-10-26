import type { Hexagram, LinePosition } from "@kinh-dich/core";

interface Props {
  hexagram: Hexagram;
  changingLines?: readonly LinePosition[];
  title?: string;
}

/** Vẽ quẻ: hào thượng ở trên cùng, hào sơ ở dưới cùng. */
export function HexagramFigure({ hexagram, changingLines = [], title }: Props) {
  const rows = hexagram.lines.map((bit, i) => ({ bit, pos: (i + 1) as LinePosition })).reverse();
  return (
    <figure className="hexagram" aria-label={`Quẻ ${hexagram.number} ${hexagram.fullName}`}>
      {title && <figcaption className="hexagram-title">{title}</figcaption>}
      <div className="lines">
        {rows.map(({ bit, pos }) => (
          <div
            key={pos}
            data-testid={`line-${pos}`}
            className={`line ${bit === 1 ? "yang" : "yin"} ${changingLines.includes(pos) ? "changing" : ""}`}
          >
            {bit === 1 ? <span /> : (
              <>
                <span />
                <span />
              </>
            )}
          </div>
        ))}
      </div>
      <figcaption>
        <strong>
          {hexagram.number}. {hexagram.fullName}
        </strong>{" "}
        <span className="hanzi">{hexagram.hanzi}</span>
        <div className="meaning">{hexagram.meaning}</div>
      </figcaption>
    </figure>
  );
}
