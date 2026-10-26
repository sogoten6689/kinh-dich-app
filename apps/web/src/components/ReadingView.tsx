import { lineLabel, type Reading } from "@kinh-dich/core";
import { HexagramFigure } from "./HexagramFigure";

export function ReadingView({ reading }: { reading: Reading }) {
  const { primary, transformed, nuclear, changingLines, guide, cast } = reading;
  return (
    <section className="reading" data-testid="reading">
      <div className="figures">
        <HexagramFigure title="Quẻ chủ" hexagram={primary} changingLines={changingLines} />
        <HexagramFigure title="Hỗ quái" hexagram={nuclear} />
        {transformed && <HexagramFigure title="Quẻ biến" hexagram={transformed} />}
      </div>
      <p>
        Hào động:{" "}
        {changingLines.length === 0
          ? "không có"
          : changingLines.map((p) => lineLabel(p, cast[p - 1] === 9)).join(", ")}
      </p>
      <p className="guide">{guide.note}</p>
      <p className="derived">
        Thác quái: {reading.opposite.fullName} · Tổng quái: {reading.inverted.fullName}
      </p>
    </section>
  );
}
