import { ABOUT, hexagramByNumber, searchHexagrams } from "@kinh-dich/core";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { HexagramDetail } from "./HexagramDetail";
import { HexagramFigure } from "./HexagramFigure";
import { colors } from "./theme";

export function LibraryScreen({ onScrollTop }: { onScrollTop?: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const results = useMemo(() => searchHexagrams(query), [query]);

  function select(n: number) {
    setSelected(n);
    onScrollTop?.();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>64 quẻ</Text>
      <Text style={styles.muted}>{ABOUT.library}</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm theo số, tên (có hoặc không dấu), chữ Hán…"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Tìm quẻ"
      />
      <Text style={styles.count}>{results.length === 64 ? "Đủ 64 quẻ theo thứ tự Văn Vương" : `${results.length} quẻ khớp`}</Text>
      {selected !== null && <HexagramDetail hexagram={hexagramByNumber(selected)} onSelect={select} onClose={() => setSelected(null)} />}
      <View style={styles.grid}>
        {results.map((h) => (
          <View key={h.number} style={styles.cell}>
            <HexagramFigure hexagram={h} size="sm" onPress={() => select(h.number)} />
          </View>
        ))}
      </View>
      {results.length === 0 && <Text style={styles.muted}>Không tìm thấy quẻ nào. Thử gõ số (1–64) hoặc tên quẻ như "thai", "Ký Tế".</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  h2: { fontSize: 24, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  muted: { color: colors.muted, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 10, padding: 12, color: colors.fg, fontSize: 16 },
  count: { fontSize: 12.5, color: colors.muted },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "33.33%" },
});
