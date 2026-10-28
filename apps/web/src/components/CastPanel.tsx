import {
  buildReading,
  CAST_METHODS,
  givenName,
  castByNumbers,
  castByYarrow,
  describeLineValue,
  LINE_NAMES,
  tossCoins,
  TOPICS,
  type CastLines,
  type CastMethod,
  type CoinToss,
  type LinePosition,
  type LineValue,
  type MeihuaResult,
  type Profile,
  type Topic,
} from "@kinh-dich/core";
import { useMemo, useState, type FormEvent } from "react";
import { Coin } from "./Coin";
import { Greeting } from "./Greeting";
import { ReadingView } from "./ReadingView";
import { Term } from "./Term";

type Method = CastMethod;
const howTo = (m: Method) => CAST_METHODS.find((x) => x.id === m)!.howTo;

export function CastPanel({ profile = null, onSetupProfile = () => {} }: { profile?: Profile | null; onSetupProfile?: () => void }) {
  const [method, setMethod] = useState<Method>("coins");
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState<Topic>("general");
  const [tosses, setTosses] = useState<CoinToss[]>([]);
  const [values, setValues] = useState<LineValue[]>([]);
  const [meihua, setMeihua] = useState<MeihuaResult | null>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reading = useMemo(() => (values.length === 6 ? buildReading(values as unknown as CastLines) : null), [values]);

  function reset(next: Method = method) {
    setMethod(next);
    setTosses([]);
    setValues([]);
    setMeihua(null);
    setError(null);
  }

  function tossOne() {
    if (values.length >= 6) return;
    const t = tossCoins();
    setTosses((prev) => [...prev, t]);
    setValues((prev) => [...prev, t.value]);
  }

  function tossAll() {
    const remaining = Array.from({ length: 6 - values.length }, () => tossCoins());
    setTosses((prev) => [...prev, ...remaining]);
    setValues((prev) => [...prev, ...remaining.map((t) => t.value)]);
  }

  function castYarrow() {
    setValues([...castByYarrow()]);
  }

  function castNumbers(e: FormEvent) {
    e.preventDefault();
    try {
      const r = castByNumbers(Number(a), Number(b));
      setError(null);
      setMeihua(r);
      setValues([...r.reading.cast]);
    } catch (err) {
      setMeihua(null);
      setValues([]);
      setError(`${err instanceof Error ? err.message : String(err)}. Hãy nhập hai số nguyên dương, ví dụ 5 và 3.`);
    }
  }

  const lastToss = tosses[tosses.length - 1];

  return (
    <div className="cast-panel">
      <Greeting profile={profile} onSetup={onSetupProfile} />

      <section className="cast-setup" aria-label="Chuẩn bị gieo quẻ">
        <label className="question-input" htmlFor="question">
          <span>Điều bạn muốn hỏi (không bắt buộc)</span>
          <input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ví dụ: Tôi có nên đổi việc trong năm nay?" />
        </label>

        <div className="topics" role="radiogroup" aria-label="Chủ đề muốn xem">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={topic === t.id}
              title={t.hint}
              className={`topic-chip topic-${t.id} ${topic === t.id ? "active" : ""}`}
              onClick={() => setTopic(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="methods" role="radiogroup" aria-label="Phương pháp gieo quẻ">
          {CAST_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={method === m.id}
              className={`method ${method === m.id ? "active" : ""}`}
              onClick={() => reset(m.id)}
            >
              <strong>{m.name}</strong>
              <span>{m.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {method === "coins" && (
        <section className="table" aria-label="Bàn gieo đồng xu">
          <div className="table-stage">
            <div className="coins" key={tosses.length} aria-live="polite">
              {lastToss ? (
                lastToss.coins.map((h, i) => <Coin key={i} heads={h} delay={i * 90} />)
              ) : (
                <>
                  <Coin heads delay={0} />
                  <Coin heads={false} delay={0} />
                  <Coin heads delay={0} />
                </>
              )}
            </div>
            <p className="stage-note">
              {lastToss
                ? `Hào ${tosses.length}: ${lastToss.coins.map((h) => (h ? 3 : 2)).join(" + ")} = ${lastToss.value} → ${describeLineValue(lastToss.value).name}`
                : howTo("coins")}
            </p>
            <div className="actions">
              <button type="button" className="primary" onClick={tossOne} disabled={values.length >= 6}>
                {values.length >= 6 ? "Đã đủ 6 hào" : `Gieo hào ${values.length + 1}`}
              </button>
              <button type="button" onClick={tossAll} disabled={values.length >= 6}>
                Gieo nhanh {values.length === 0 ? "cả 6 hào" : "các hào còn lại"}
              </button>
              {values.length > 0 && (
                <button type="button" className="ghost" onClick={() => reset()}>
                  Gieo lại
                </button>
              )}
            </div>
          </div>
          <LineBuilder values={values} tosses={tosses} />
        </section>
      )}

      {method === "yarrow" && (
        <section className="table" aria-label="Gieo cỏ thi">
          <div className="table-stage">
            <p className="stage-note">{howTo("yarrow")}</p>
            <div className="actions">
              <button type="button" className="primary" onClick={castYarrow}>
                {values.length ? "Gieo lại" : "Gieo cỏ thi"}
              </button>
            </div>
          </div>
          <LineBuilder values={values} />
        </section>
      )}

      {method === "numbers" && (
        <section className="table" aria-label="Mai Hoa Dịch Số">
          <form className="numbers" onSubmit={castNumbers}>
            <label htmlFor="num-a">
              Số thứ nhất
              <input id="num-a" inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="vd. 5" />
            </label>
            <label htmlFor="num-b">
              Số thứ hai
              <input id="num-b" inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="vd. 3" />
            </label>
            <button type="submit" className="primary">
              Lập quẻ
            </button>
          </form>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {meihua?.steps && (
            <ol className="steps" aria-label="Các bước tính">
              <li>
                <span className="step-calc">{a} ÷ 8 dư {meihua.steps.upperRemainder % 8}</span>
                <span>
                  → số {meihua.steps.upperRemainder} là <strong>{meihua.reading.primary.upper.symbol} {meihua.reading.primary.upper.name}</strong>: thượng quái
                </span>
              </li>
              <li>
                <span className="step-calc">{b} ÷ 8 dư {meihua.steps.lowerRemainder % 8}</span>
                <span>
                  → số {meihua.steps.lowerRemainder} là <strong>{meihua.reading.primary.lower.symbol} {meihua.reading.primary.lower.name}</strong>: hạ quái
                </span>
              </li>
              <li>
                <span className="step-calc">
                  ({a} + {b}) ÷ 6 dư {meihua.steps.movingRemainder % 6}
                </span>
                <span>
                  → <strong>hào {meihua.movingLine}</strong> động
                </span>
              </li>
            </ol>
          )}
          <p className="stage-note">{howTo("numbers")}</p>
        </section>
      )}

      {reading && <ReadingView reading={reading} question={question.trim() || undefined} asker={profile ? givenName(profile.name) : undefined} meihua={meihua} topic={topic} />}
    </div>
  );
}

/** Quẻ đang dựng: hào hiện dần từ dưới lên, kèm giải thích giá trị từng hào. */
function LineBuilder({ values, tosses }: { values: readonly LineValue[]; tosses?: readonly CoinToss[] }) {
  const slots = [6, 5, 4, 3, 2, 1] as const;
  return (
    <ol className="builder" aria-label="Các hào đã gieo" reversed>
      {slots.map((pos) => {
        const v = values[pos - 1];
        const t = tosses?.[pos - 1];
        if (v === undefined) {
          return (
            <li key={pos} className="slot empty">
              <span className="slot-name">Hào {pos}</span>
              <span className="slot-line" />
              <span className="slot-info">{LINE_NAMES[pos as LinePosition]}</span>
            </li>
          );
        }
        const info = describeLineValue(v);
        return (
          <li key={pos} className={`slot ${info.yang ? "yang" : "yin"} ${info.changing ? "changing" : ""}`}>
            <span className="slot-name">Hào {pos}</span>
            <span className="slot-line">
              <span />
              {!info.yang && <span />}
              {info.mark && <em>{info.mark}</em>}
            </span>
            <span className="slot-info">
              <strong>
                {v} · {info.name}
              </strong>
              {t && <small>{t.coins.map((h) => (h ? "ngửa" : "sấp")).join(", ")}</small>}
              <small>{info.changing ? <Term k="hao-dong">sẽ đổi</Term> : "giữ nguyên"}</small>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
