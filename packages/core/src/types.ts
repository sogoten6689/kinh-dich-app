/** Một hào: 1 = dương (—), 0 = âm (- -). */
export type Bit = 0 | 1;

/** Ba hào của một quẻ đơn, thứ tự từ dưới lên trên. */
export type TrigramLines = readonly [Bit, Bit, Bit];

/** Sáu hào của một quẻ kép, thứ tự từ dưới (hào sơ) lên trên (hào thượng). */
export type HexagramLines = readonly [Bit, Bit, Bit, Bit, Bit, Bit];

/**
 * Giá trị hào khi gieo:
 * 6 = lão âm (động, biến thành dương), 7 = thiếu dương (tĩnh),
 * 8 = thiếu âm (tĩnh), 9 = lão dương (động, biến thành âm).
 */
export type LineValue = 6 | 7 | 8 | 9;

/** Sáu giá trị hào từ dưới lên trên. */
export type CastLines = readonly [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue];

/** Vị trí hào 1..6 (1 = hào sơ, 6 = hào thượng). */
export type LinePosition = 1 | 2 | 3 | 4 | 5 | 6;

/** Khóa quẻ đơn theo phiên âm pinyin để tránh trùng (Càn/Cấn): qian=Càn, dui=Đoài, li=Ly, zhen=Chấn, xun=Tốn, kan=Khảm, gen=Cấn, kun=Khôn. */
export type TrigramKey = "qian" | "dui" | "li" | "zhen" | "xun" | "kan" | "gen" | "kun";

export type Element = "kim" | "moc" | "thuy" | "hoa" | "tho";

/** Hàm sinh số ngẫu nhiên trong [0, 1), giống Math.random. */
export type Rng = () => number;
