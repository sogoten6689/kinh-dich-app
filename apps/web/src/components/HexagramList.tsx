import { searchHexagrams, type Hexagram } from "@kinh-dich/core";
import { useMemo, useState } from "react";
import { HexagramFigure } from "./HexagramFigure";

export function HexagramList() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Hexagram | null>(null);
  const results = useMemo(() => searchHexagrams(query), [query]);
  return (
    <div className="hexagram-list">
      <input aria-label="Tìm quẻ" placeholder="Tìm theo số, tên (có/không dấu), chữ Hán…" value={query} onChange={(e) => setQuery(e.target.value)} />
      {selected && <HexagramFigure hexagram={selected} />}
      <ul>
        {results.map((h) => (
          <li key={h.number}>
            <button onClick={() => setSelected(h)}>
              {h.upper.symbol}
              {h.lower.symbol} {h.number}. {h.fullName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
