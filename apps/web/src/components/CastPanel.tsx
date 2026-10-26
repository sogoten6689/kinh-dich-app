import { buildReading, castByCoins, castByNumbers, castByYarrow, type MeihuaResult, type Reading } from "@kinh-dich/core";
import { useState, type FormEvent } from "react";
import { ReadingView } from "./ReadingView";

type Method = "coins" | "yarrow" | "numbers";

export function CastPanel() {
  const [method, setMethod] = useState<Method>("coins");
  const [reading, setReading] = useState<Reading | null>(null);
  const [meihua, setMeihua] = useState<MeihuaResult | null>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  function cast(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setMeihua(null);
    if (method === "coins") setReading(buildReading(castByCoins().lines));
    else if (method === "yarrow") setReading(buildReading(castByYarrow()));
    else {
      try {
        const r = castByNumbers(Number(a), Number(b));
        setMeihua(r);
        setReading(r.reading);
      } catch (err) {
        setReading(null);
        setError(err instanceof Error ? err.message : String(err));
      }
    }
  }

  return (
    <div className="cast-panel">
      <form onSubmit={cast}>
        <label>
          Phương pháp{" "}
          <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
            <option value="coins">Gieo 3 đồng xu</option>
            <option value="yarrow">Cỏ thi (mô phỏng)</option>
            <option value="numbers">Mai Hoa — theo hai số</option>
          </select>
        </label>
        {method === "numbers" && (
          <div className="numbers">
            <input aria-label="Số thứ nhất" inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="Số 1" />
            <input aria-label="Số thứ hai" inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="Số 2" />
          </div>
        )}
        <button type="submit">Lập quẻ</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {meihua && (
        <p className="meihua">
          Thể: {meihua.ti.name} · Dụng: {meihua.yong.name} — <strong>{meihua.verdict.label}</strong>. {meihua.verdict.explanation}
        </p>
      )}
      {reading && <ReadingView reading={reading} />}
    </div>
  );
}
