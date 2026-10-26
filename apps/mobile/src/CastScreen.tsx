import {
  buildReading,
  CAST_METHODS,
  castByNumbers,
  castByYarrow,
  describeLineValue,
  LINE_NAMES,
  tossCoins,
  type CastLines,
  type CastMethod,
  type CoinToss,
  type LinePosition,
  type LineValue,
  type MeihuaResult,
} from "@kinh-dich/core";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Coin } from "./Coin";
import { ReadingView } from "./ReadingView";
import { colors } from "./theme";

const howTo = (m: CastMethod) => CAST_METHODS.find((x) => x.id === m)!.howTo;

function Button({ label, onPress, primary, disabled }: { label: string; onPress: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.btn, primary && styles.btnPrimary, (disabled || pressed) && { opacity: disabled ? 0.5 : 0.85 }]}
    >
      <Text style={[styles.btnText, primary && styles.btnTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

export function CastScreen() {
  const [method, setMethod] = useState<CastMethod>("coins");
  const [question, setQuestion] = useState("");
  const [tosses, setTosses] = useState<CoinToss[]>([]);
  const [values, setValues] = useState<LineValue[]>([]);
  const [meihua, setMeihua] = useState<MeihuaResult | null>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reading = useMemo(() => (values.length === 6 ? buildReading(values as unknown as CastLines) : null), [values]);
  const lastToss = tosses[tosses.length - 1];

  function reset(next: CastMethod = method) {
    setMethod(next);
    setTosses([]);
    setValues([]);
    setMeihua(null);
    setError(null);
  }

  function tossOne() {
    if (values.length >= 6) return;
    const t = tossCoins();
    setTosses((p) => [...p, t]);
    setValues((p) => [...p, t.value]);
  }

  function tossAll() {
    const rest = Array.from({ length: 6 - values.length }, () => tossCoins());
    setTosses((p) => [...p, ...rest]);
    setValues((p) => [...p, ...rest.map((t) => t.value)]);
  }

  function castNumbers() {
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

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Điều bạn muốn hỏi (không bắt buộc)</Text>
        <TextInput style={styles.input} value={question} onChangeText={setQuestion} placeholder="Ví dụ: Tôi có nên đổi việc trong năm nay?" placeholderTextColor={colors.muted} />
      </View>

      <View style={styles.methods} accessibilityRole="radiogroup">
        {CAST_METHODS.map((m) => (
          <Pressable
            key={m.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: method === m.id }}
            onPress={() => reset(m.id)}
            style={[styles.method, method === m.id && styles.methodActive]}
          >
            <Text style={styles.methodName}>{m.name}</Text>
            <Text style={styles.small}>{m.hint}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.table}>
        {method === "coins" && (
          <>
            <View style={styles.coins}>
              {(lastToss?.coins ?? [true, false, true]).map((h, i) => (
                <Coin key={i} heads={h} delay={i * 90} spinKey={tosses.length} />
              ))}
            </View>
            <Text style={styles.note}>
              {lastToss
                ? `Hào ${tosses.length}: ${lastToss.coins.map((h) => (h ? 3 : 2)).join(" + ")} = ${lastToss.value} → ${describeLineValue(lastToss.value).name}`
                : howTo("coins")}
            </Text>
            <View style={styles.actions}>
              <Button primary label={values.length >= 6 ? "Đã đủ 6 hào" : `Gieo hào ${values.length + 1}`} onPress={tossOne} disabled={values.length >= 6} />
              <Button label={values.length === 0 ? "Gieo nhanh cả 6 hào" : "Gieo nhanh các hào còn lại"} onPress={tossAll} disabled={values.length >= 6} />
              {values.length > 0 && <Button label="Gieo lại" onPress={() => reset()} />}
            </View>
            <LineBuilder values={values} tosses={tosses} />
          </>
        )}

        {method === "yarrow" && (
          <>
            <Text style={styles.note}>{howTo("yarrow")}</Text>
            <View style={styles.actions}>
              <Button primary label={values.length ? "Gieo lại" : "Gieo cỏ thi"} onPress={() => setValues([...castByYarrow()])} />
            </View>
            <LineBuilder values={values} />
          </>
        )}

        {method === "numbers" && (
          <>
            <View style={styles.numbers}>
              <View style={styles.numField}>
                <Text style={styles.label}>Số thứ nhất</Text>
                <TextInput style={styles.input} keyboardType="number-pad" value={a} onChangeText={setA} placeholder="vd. 5" placeholderTextColor={colors.muted} />
              </View>
              <View style={styles.numField}>
                <Text style={styles.label}>Số thứ hai</Text>
                <TextInput style={styles.input} keyboardType="number-pad" value={b} onChangeText={setB} placeholder="vd. 3" placeholderTextColor={colors.muted} />
              </View>
            </View>
            <Button primary label="Lập quẻ" onPress={castNumbers} />
            {error && <Text style={styles.error}>{error}</Text>}
            {meihua?.steps && (
              <View style={styles.steps}>
                <Step calc={`${a} ÷ 8 dư ${meihua.steps.upperRemainder % 8}`} text={`số ${meihua.steps.upperRemainder} là ${meihua.reading.primary.upper.symbol} ${meihua.reading.primary.upper.name}: thượng quái`} />
                <Step calc={`${b} ÷ 8 dư ${meihua.steps.lowerRemainder % 8}`} text={`số ${meihua.steps.lowerRemainder} là ${meihua.reading.primary.lower.symbol} ${meihua.reading.primary.lower.name}: hạ quái`} />
                <Step calc={`(${a} + ${b}) ÷ 6 dư ${meihua.steps.movingRemainder % 6}`} text={`hào ${meihua.movingLine} động`} />
              </View>
            )}
            <Text style={styles.note}>{howTo("numbers")}</Text>
          </>
        )}
      </View>

      {reading && <ReadingView reading={reading} question={question.trim() || undefined} meihua={meihua} />}
    </View>
  );
}

function Step({ calc, text }: { calc: string; text: string }) {
  return (
    <View style={styles.step}>
      <Text style={styles.stepCalc}>{calc}</Text>
      <Text style={styles.body}>→ {text}</Text>
    </View>
  );
}

/** Quẻ đang dựng: hào hiện dần từ dưới lên, kèm giải thích giá trị từng hào. */
function LineBuilder({ values, tosses }: { values: readonly LineValue[]; tosses?: readonly CoinToss[] }) {
  return (
    <View style={styles.builder}>
      {([6, 5, 4, 3, 2, 1] as const).map((pos) => {
        const v = values[pos - 1];
        if (v === undefined) {
          return (
            <View key={pos} style={[styles.slot, styles.slotEmpty]}>
              <Text style={styles.slotName}>Hào {pos}</Text>
              <View style={styles.slotDots} />
              <Text style={styles.small}>{LINE_NAMES[pos as LinePosition]}</Text>
            </View>
          );
        }
        const info = describeLineValue(v);
        const t = tosses?.[pos - 1];
        const seg = [styles.seg, { backgroundColor: info.changing ? colors.accent : colors.ink }];
        return (
          <View key={pos} style={styles.slot}>
            <Text style={styles.slotName}>Hào {pos}</Text>
            <View style={styles.slotLine}>
              <View style={seg} />
              {!info.yang && <View style={seg} />}
              {info.mark ? <Text style={styles.slotMark}>{info.mark}</Text> : null}
            </View>
            <View style={styles.slotInfo}>
              <Text style={styles.bold}>
                {v} · {info.name}
              </Text>
              {t && <Text style={styles.small}>{t.coins.map((h) => (h ? "ngửa" : "sấp")).join(", ")}</Text>}
              <Text style={styles.small}>{info.changing ? "sẽ đổi (hào động)" : "giữ nguyên"}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  field: { gap: 6 },
  label: { fontSize: 13, color: colors.muted },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 10, padding: 12, color: colors.fg, fontSize: 16 },
  methods: { gap: 8 },
  method: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, gap: 2 },
  methodActive: { borderColor: colors.accent, borderWidth: 2, backgroundColor: colors.accentSoft },
  methodName: { fontWeight: "700", color: colors.fg },
  small: { fontSize: 12.5, color: colors.muted },
  table: { gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surface },
  coins: { flexDirection: "row", justifyContent: "center", gap: 16, paddingTop: 30 },
  note: { fontSize: 13.5, color: colors.muted, lineHeight: 20 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  btnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  btnText: { color: colors.fg, fontWeight: "500" },
  btnTextPrimary: { color: "#fff", fontWeight: "600" },
  builder: { gap: 6 },
  slot: { flexDirection: "row", alignItems: "center", gap: 10, padding: 8, borderRadius: 8, backgroundColor: colors.card, minHeight: 46 },
  slotEmpty: { backgroundColor: "transparent", borderWidth: 1, borderStyle: "dashed", borderColor: colors.line },
  slotName: { width: 46, fontSize: 12, color: colors.muted },
  slotDots: { width: 90, borderTopWidth: 2, borderStyle: "dotted", borderColor: colors.line },
  slotLine: { width: 90, height: 11, flexDirection: "row", gap: 12 },
  seg: { flex: 1, borderRadius: 2 },
  slotMark: { position: "absolute", left: 36, top: -4, width: 18, height: 18, lineHeight: 18, textAlign: "center", borderRadius: 9, overflow: "hidden", backgroundColor: colors.card, color: colors.accent, fontWeight: "700", fontSize: 12 },
  slotInfo: { flex: 1 },
  bold: { fontWeight: "700", color: colors.fg },
  body: { color: colors.fg, fontSize: 14 },
  numbers: { flexDirection: "row", gap: 10 },
  numField: { flex: 1, gap: 4 },
  error: { color: colors.bad },
  steps: { gap: 6 },
  step: { padding: 10, borderRadius: 8, backgroundColor: colors.card, gap: 2 },
  stepCalc: { color: colors.accent, fontWeight: "700" },
});
