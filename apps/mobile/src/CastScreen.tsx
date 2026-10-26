import { buildReading, castByCoins, castByNumbers, lineLabel, type MeihuaResult, type Reading } from "@kinh-dich/core";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { HexagramFigure } from "./HexagramFigure";
import { colors } from "./theme";

export function CastScreen() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [meihua, setMeihua] = useState<MeihuaResult | null>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  function castCoins() {
    setError(null);
    setMeihua(null);
    setReading(buildReading(castByCoins().lines));
  }

  function castNumbers() {
    try {
      const r = castByNumbers(Number(a), Number(b));
      setError(null);
      setMeihua(r);
      setReading(r.reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={castCoins}>
        <Text style={styles.buttonText}>Gieo 3 đồng xu</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <TextInput style={styles.input} keyboardType="number-pad" value={a} onChangeText={setA} placeholder="Số 1" />
        <TextInput style={styles.input} keyboardType="number-pad" value={b} onChangeText={setB} placeholder="Số 2" />
        <TouchableOpacity style={styles.button} onPress={castNumbers}>
          <Text style={styles.buttonText}>Mai Hoa</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {meihua && (
        <Text style={styles.text}>
          Thể: {meihua.ti.name} · Dụng: {meihua.yong.name} — {meihua.verdict.label}. {meihua.verdict.explanation}
        </Text>
      )}
      {reading && (
        <View>
          <HexagramFigure title="Quẻ chủ" hexagram={reading.primary} changingLines={reading.changingLines} />
          <HexagramFigure title="Hỗ quái" hexagram={reading.nuclear} />
          {reading.transformed && <HexagramFigure title="Quẻ biến" hexagram={reading.transformed} />}
          <Text style={styles.text}>
            Hào động:{" "}
            {reading.changingLines.length === 0
              ? "không có"
              : reading.changingLines.map((p) => lineLabel(p, reading.cast[p - 1] === 9)).join(", ")}
          </Text>
          <Text style={styles.guide}>{reading.guide.note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: colors.muted, borderRadius: 8, padding: 10, color: colors.fg },
  button: { backgroundColor: colors.accent, padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: colors.accent },
  text: { color: colors.fg },
  guide: { color: colors.fg, borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: 10, marginTop: 8 },
});
