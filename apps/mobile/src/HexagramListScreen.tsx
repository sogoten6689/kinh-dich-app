import { searchHexagrams, type Hexagram } from "@kinh-dich/core";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { HexagramFigure } from "./HexagramFigure";
import { colors } from "./theme";

export function HexagramListScreen() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Hexagram | null>(null);
  const results = useMemo(() => searchHexagrams(query), [query]);
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Tìm theo số, tên, chữ Hán…" />
      {selected && <HexagramFigure hexagram={selected} />}
      {results.map((h) => (
        <TouchableOpacity key={h.number} onPress={() => setSelected(h)}>
          <Text style={styles.item}>
            {h.upper.symbol}
            {h.lower.symbol} {h.number}. {h.fullName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  input: { borderWidth: 1, borderColor: colors.muted, borderRadius: 8, padding: 10, color: colors.fg },
  item: { color: colors.fg, paddingVertical: 6 },
});
