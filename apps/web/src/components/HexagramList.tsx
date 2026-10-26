import { ABOUT, hexagramByNumber, searchHexagrams } from "@kinh-dich/core";
import { useMemo, useState } from "react";
import { HexagramDetail } from "./HexagramDetail";
import { HexagramFigure } from "./HexagramFigure";

export function HexagramList() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const results = useMemo(() => searchHexagrams(query), [query]);
  return (
    <div className="library">
      <div className="library-head">
        <h2>64 quẻ</h2>
        <p>{ABOUT.library}</p>
        <input
          id="search"
          aria-label="Tìm quẻ"
          type="search"
          placeholder="Tìm theo số, tên (có hoặc không dấu), chữ Hán…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="count">{results.length === 64 ? "Đủ 64 quẻ theo thứ tự Văn Vương" : `${results.length} quẻ khớp`}</p>
      </div>
      {selected !== null && <HexagramDetail hexagram={hexagramByNumber(selected)} onSelect={setSelected} onClose={() => setSelected(null)} />}
      <ul className="grid">
        {results.map((h) => (
          <li key={h.number}>
            <HexagramFigure hexagram={h} size="sm" onSelect={() => setSelected(h.number)} />
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="empty">Không tìm thấy quẻ nào. Thử gõ số (1–64) hoặc tên quẻ như "thai", "Ký Tế".</p>}
    </div>
  );
}
