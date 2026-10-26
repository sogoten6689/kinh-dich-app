import { LUCK_LABEL, readTopic, TREND_LABEL, type Luck, type MeihuaResult, type Reading, type SubjectTopic } from "@kinh-dich/core";

export function LuckBadge({ luck, label }: { luck: Luck; label?: string }) {
  return (
    <span className={`luck luck-${luck}`}>
      {label && <small>{label}</small>}
      {LUCK_LABEL[luck]}
    </span>
  );
}

/** Luận theo chủ đề: mức cát/hung hiện tại → chiều hướng, rồi từng phần giải thích. */
export function TopicCard({ reading, topic, meihua }: { reading: Reading; topic: SubjectTopic; meihua?: MeihuaResult | null }) {
  const t = readTopic(reading, topic, meihua);
  return (
    <section className={`topic-card topic-${topic}`} aria-label={`Luận về ${t.title}`}>
      <header>
        <p className="eyebrow">Luận theo chủ đề</p>
        <h3>{t.title}</h3>
        <div className="luck-row">
          <LuckBadge luck={t.now} label="Hiện tại" />
          {t.future && (
            <>
              <span className="luck-arrow" aria-hidden="true">
                →
              </span>
              <LuckBadge luck={t.future} label="Chiều hướng" />
            </>
          )}
          <span className={`trend trend-${t.trend}`}>{TREND_LABEL[t.trend]}</span>
        </div>
      </header>
      <dl>
        {t.sections.map((s) => (
          <div key={s.key} className={`topic-${s.key}`}>
            <dt>{s.title}</dt>
            <dd>{s.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
