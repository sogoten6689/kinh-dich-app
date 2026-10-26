import { LUCK_LABEL, readTopic, TREND_LABEL, type Luck, type MeihuaResult, type Reading, type SubjectTopic } from "@kinh-dich/core";
import { StyleSheet, Text, View } from "react-native";
import { colors, LUCK_COLOR, TOPIC_COLOR } from "./theme";

export function LuckBadge({ luck, label }: { luck: Luck; label?: string }) {
  const c = LUCK_COLOR[luck];
  return (
    <View style={[styles.luck, { backgroundColor: c.bg }]}>
      {label ? <Text style={[styles.luckLabel, { color: c.fg }]}>{label}</Text> : null}
      <Text style={[styles.luckText, { color: c.fg }]}>{LUCK_LABEL[luck]}</Text>
    </View>
  );
}

/** Cùng nội dung với apps/web/src/components/TopicCard.tsx. */
export function TopicCard({ reading, topic, meihua }: { reading: Reading; topic: SubjectTopic; meihua?: MeihuaResult | null }) {
  const t = readTopic(reading, topic, meihua);
  const c = TOPIC_COLOR[topic];
  const trendColor = t.trend === "up" ? colors.good : t.trend === "down" ? colors.bad : colors.muted;
  return (
    <View style={[styles.card, { borderLeftColor: c }]} accessibilityLabel={`Luận về ${t.title}`}>
      <Text style={styles.eyebrow}>LUẬN THEO CHỦ ĐỀ</Text>
      <Text style={[styles.title, { color: c }]}>{t.title}</Text>
      <View style={styles.row}>
        <LuckBadge luck={t.now} label="Hiện tại" />
        {t.future && (
          <>
            <Text style={styles.arrow}>→</Text>
            <LuckBadge luck={t.future} label="Chiều hướng" />
          </>
        )}
        <Text style={[styles.trend, { color: trendColor, borderColor: trendColor }]}>{TREND_LABEL[t.trend]}</Text>
      </View>
      {t.sections.map((s) => (
        <View key={s.key} style={[styles.section, s.key === "advice" && styles.advice]}>
          <Text style={styles.dt}>{s.title}</Text>
          <Text style={styles.dd}>{s.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, padding: 14, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderLeftWidth: 5 },
  eyebrow: { fontSize: 11, letterSpacing: 1, color: colors.accent, fontWeight: "700" },
  title: { fontSize: 20, fontWeight: "700", fontFamily: "serif" },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  luck: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, alignItems: "center" },
  luckLabel: { fontSize: 11 },
  luckText: { fontSize: 14, fontWeight: "700" },
  arrow: { color: colors.muted, fontSize: 18 },
  trend: { fontSize: 12.5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, overflow: "hidden" },
  section: { gap: 2 },
  advice: { padding: 10, borderRadius: 8, backgroundColor: colors.card },
  dt: { fontWeight: "700", color: colors.fg },
  dd: { color: colors.fg, lineHeight: 21, fontSize: 14.5 },
});
