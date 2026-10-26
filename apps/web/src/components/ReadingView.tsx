import { explainReading, lineLabel, type ExplanationKey, type MeihuaResult, type Reading } from "@kinh-dich/core";
import { HexagramFigure } from "./HexagramFigure";
import { Term } from "./Term";
import { WuxingCycle } from "./WuxingCycle";

const SECTION_TERM: Partial<Record<ExplanationKey, string>> = {
  overview: "que-chu",
  structure: "que-kep",
  changing: "hao-dong",
  future: "que-bien",
  nuclear: "ho-quai",
  related: "thac-quai",
  guide: "thoan-tu",
};

interface Props {
  reading: Reading;
  question?: string;
  meihua?: MeihuaResult | null;
}

export function ReadingView({ reading, question, meihua }: Props) {
  const { primary, transformed, nuclear, changingLines, cast } = reading;
  const sections = explainReading(reading);
  return (
    <section className="reading" data-testid="reading" aria-label="Kết quả gieo quẻ">
      {question && (
        <p className="question">
          <span>Câu hỏi</span> {question}
        </p>
      )}

      <div className="hexagram-flow">
        <HexagramFigure title="Quẻ chủ" hexagram={primary} changingLines={changingLines} size="lg" showTrigrams />
        {transformed ? (
          <>
            <div className="flow-arrow" aria-hidden="true">
              <span>{changingLines.map((p) => lineLabel(p, cast[p - 1] === 9)).join(" · ")}</span>
              <svg viewBox="0 0 80 16">
                <path d="M0 8 H72 M64 2 L74 8 L64 14" />
              </svg>
              <span>biến thành</span>
            </div>
            <HexagramFigure title="Quẻ biến" hexagram={transformed} changingLines={changingLines} marks={false} size="lg" showTrigrams />
          </>
        ) : (
          <p className="flow-still">Không có hào động — quẻ đứng yên, không có quẻ biến.</p>
        )}
        <HexagramFigure title="Hỗ quái" hexagram={nuclear} size="sm" />
      </div>

      {meihua && (
        <div className="tiyong">
          <div className="tiyong-text">
            <h3>
              <Term k="the">Thể</Term> và <Term k="dung">Dụng</Term>
            </h3>
            <p>
              Thể là <strong>{meihua.ti.symbol} {meihua.ti.name}</strong> (người hỏi), Dụng là{" "}
              <strong>
                {meihua.yong.symbol} {meihua.yong.name}
              </strong>{" "}
              (sự việc, chứa hào động {meihua.movingLine}).
            </p>
            <p className={`verdict ${meihua.verdict.outcome}`}>
              <strong>{meihua.verdict.label}</strong>
              <span>{meihua.verdict.explanation}</span>
            </p>
          </div>
          <WuxingCycle ti={meihua.ti.element} yong={meihua.yong.element} />
        </div>
      )}

      <ol className="explain">
        {sections.map((s) => (
          <li key={s.key} className={`explain-${s.key}`}>
            <h3>{SECTION_TERM[s.key] ? <Term k={SECTION_TERM[s.key]!}>{s.title}</Term> : s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
