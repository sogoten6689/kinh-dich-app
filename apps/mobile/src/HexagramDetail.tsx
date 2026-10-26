import { ELEMENT_NAMES, explainHexagram, hexagramTopics, invertedHexagram, nuclearHexagram, oppositeHexagram, TOPICS, type Hexagram } from "@kinh-dich/core";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HexagramFigure } from "./HexagramFigure";
import { Term } from "./Term";
import { colors, ELEMENT_COLOR, TOPIC_COLOR } from "./theme";
import { LuckBadge } from "./TopicCard";

export function HexagramDetail({ hexagram: h, onSelect, onClose }: { hexagram: Hexagram; onSelect: (n: number) => void; onClose: () => void }) {
  const e = explainHexagram(h);
  const topics = hexagramTopics(h);
  const related = [
    { label: "Hỗ quái", term: "ho-quai", h: nuclearHexagram(h) },
    { label: "Thác quái", term: "thac-quai", h: oppositeHexagram(h) },
    { label: "Tổng quái", term: "tong-quai", h: invertedHexagram(h) },
  ];
  return (
    <View style={styles.card} accessibilityLabel={`Chi tiết quẻ ${h.number}`}>
      <Pressable onPress={onClose} accessibilityRole="button" style={styles.close}>
        <Text style={styles.closeText}>Đóng</Text>
      </Pressable>
      <Text style={styles.eyebrow}>QUẺ SỐ {h.number}</Text>
      <Text style={styles.title}>
        {h.fullName} <Text style={styles.hanzi}>{h.hanzi}</Text>
      </Text>
      <Text style={styles.meaning}>{h.meaning}</Text>
      <HexagramFigure hexagram={h} size="lg" showTrigrams caption={false} />

      <View style={styles.pair}>
        {[
          { pos: "Ngoại quái (trên)", t: h.upper },
          { pos: "Nội quái (dưới)", t: h.lower },
        ].map(({ pos, t }) => (
          <View key={pos} style={[styles.chip, { borderColor: ELEMENT_COLOR[t.element] }]}>
            <Text style={styles.sym}>{t.symbol}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.small}>{pos}</Text>
              <Text style={styles.bold}>
                {t.name} — {t.natureVi}
              </Text>
              <Text style={styles.small}>
                Hành {ELEMENT_NAMES[t.element]} · {t.quality}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.body}>{e.relation}</Text>

      <Text style={styles.h3}>Sáu hào</Text>
      <View style={styles.inline}>
        <Term k="dac-chinh" label="Đắc chính" style={styles.small} />
        <Term k="dac-trung" label="Đắc trung" style={styles.small} />
      </View>
      {[...e.lines].reverse().map((l) => (
        <View key={l.position} style={styles.lineRow}>
          <View style={styles.mini}>
            <View style={styles.miniSeg} />
            {!l.yang && <View style={styles.miniSeg} />}
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.bold}>{l.label}</Text>
            <Text style={styles.body}>{l.role}</Text>
            <View style={styles.badges}>
              <Text style={[styles.badge, l.correct ? styles.badgeGood : styles.badgeOff]}>{l.correct ? "Đắc chính" : "Thất chính"}</Text>
              {l.central && <Text style={[styles.badge, styles.badgeGood]}>Đắc trung</Text>}
            </View>
          </View>
        </View>
      ))}

      <View style={styles.inlineCenter}>
        <Text style={styles.h3}>Theo chủ đề</Text>
        <LuckBadge luck={topics.luck} />
      </View>
      {TOPICS.filter((t) => t.id !== "general").map((t) => {
        const id = t.id as "love" | "career" | "fortune";
        return (
          <View key={t.id} style={[styles.topicMini, { borderTopColor: TOPIC_COLOR[id] }]}>
            <Text style={[styles.bold, { color: TOPIC_COLOR[id] }]}>{t.name}</Text>
            <Text style={styles.body}>{topics[id]}</Text>
          </View>
        );
      })}

      <Text style={styles.h3}>Quẻ liên quan</Text>
      <View style={styles.related}>
        {related.map((r) => (
          <View key={r.label} style={styles.relatedItem}>
            <Term k={r.term} label={r.label} style={styles.small} />
            <HexagramFigure hexagram={r.h} size="sm" onPress={() => onSelect(r.h.number)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  close: { position: "absolute", top: 12, right: 12, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.line, zIndex: 1 },
  closeText: { color: colors.fg },
  eyebrow: { fontSize: 11, letterSpacing: 1, color: colors.accent, fontWeight: "700" },
  title: { fontSize: 22, fontFamily: "serif", fontWeight: "700", color: colors.fg, paddingRight: 60 },
  hanzi: { color: colors.muted, fontWeight: "400" },
  meaning: { fontSize: 16, color: colors.fg },
  pair: { gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, borderWidth: 2, backgroundColor: colors.surface },
  sym: { fontSize: 28, color: colors.fg },
  small: { fontSize: 12.5, color: colors.muted },
  bold: { fontWeight: "700", color: colors.fg },
  body: { fontSize: 14, lineHeight: 20, color: colors.fg },
  h3: { fontSize: 17, fontFamily: "serif", fontWeight: "700", color: colors.fg, marginTop: 8 },
  inline: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  lineRow: { flexDirection: "row", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  mini: { width: 44, height: 8, flexDirection: "row", gap: 7, marginTop: 6 },
  miniSeg: { flex: 1, backgroundColor: colors.ink, borderRadius: 1 },
  badges: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  badge: { fontSize: 11.5, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  badgeGood: { backgroundColor: colors.goodSoft, color: colors.good },
  badgeOff: { backgroundColor: colors.surface, color: colors.muted },
  inlineCenter: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  topicMini: { padding: 12, borderRadius: 10, backgroundColor: colors.surface, borderTopWidth: 3, gap: 4 },
  related: { flexDirection: "row", gap: 8 },
  relatedItem: { flex: 1, alignItems: "center", padding: 6, borderRadius: 12, backgroundColor: colors.surface, gap: 4 },
});
