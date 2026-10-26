/** Đồng tiền cổ có lỗ vuông. Mặt ngửa (chữ) = 3, mặt sấp (trơn) = 2. Lật bằng CSS 3D. */
export function Coin({ heads, delay = 0 }: { heads: boolean; delay?: number }) {
  return (
    <span className={`coin ${heads ? "heads" : "tails"}`} style={{ animationDelay: `${delay}ms` }} role="img" aria-label={heads ? "Ngửa (3)" : "Sấp (2)"}>
      <span className="coin-face coin-front">
        <span className="coin-hole" />
        <span className="coin-glyph g1">通</span>
        <span className="coin-glyph g2">寶</span>
      </span>
      <span className="coin-face coin-back">
        <span className="coin-hole" />
      </span>
      <span className="coin-value">{heads ? 3 : 2}</span>
    </span>
  );
}
