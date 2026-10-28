import { explainReading, lineLabel, type ExplanationKey, type MeihuaResult, type Reading, type Topic } from "@kinh-dich/core";
import { StyleSheet, Text, View } from "react-native";
import { HexagramFigure } from "./HexagramFigure";
import { Term } from "./Term";
import { colors } from "./theme";
import { TopicCard } from "./TopicCard";
import { WuxingCycle } from "./WuxingCycle";

const SECTION_TERM: Partial<Record<ExplanationKey, string>> = {
  overview: "que-chu",
  structure: "que-kep",
  changing: "hao-dong",
  future: "que-bien",
  nuclear: "ho-quai",
  related: "thac-quai",
  guide: "thoan-tu",
};

export function ReadingView({
  reading,
  question,
  asker,
  meihua,
  topic = "general",
}: {
  reading: Reading;
  question?: string;
  /** Tên gọi của người hỏi (từ hồ sơ). */
  asker?: string;
  meihua?: MeihuaResult | null;
  topic?: Topic;
}) {
  const { primary, transformed, nuclear, changingLines, cast } = reading;
  const sections = explainReading(reading);
  return (
    <View style={styles.card} accessibilityLabel="Kết quả gieo quẻ">
      {question ? (
        <View>
          <Text style={styles.eyebrow}>{asker ? `${asker.toUpperCase()} HỎI` : "CÂU HỎI"}</Text>
          <Text style={styles.question}>{question}</Text>
        </View>
      ) : null}

      <View style={styles.flow}>
        <HexagramFigure title="Quẻ chủ" hexagram={primary} changingLines={changingLines} size="lg" showTrigrams />
        {transformed ? (
          <>
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>{changingLines.map((p) => lineLabel(p, cast[p - 1] === 9)).join(" · ")}</Text>
              <Text style={styles.arrowGlyph}>↓ biến thành ↓</Text>
            </View>
            <HexagramFigure title="Quẻ biến" hexagram={transformed} changingLines={changingLines} marks={false} size="lg" showTrigrams />
          </>
        ) : (
          <Text style={styles.still}>Không có hào động — quẻ đứng yên, không có quẻ biến.</Text>
        )}
        <HexagramFigure title="Hỗ quái" hexagram={nuclear} size="sm" />
      </View>

      {meihua ? (
        <View style={styles.tiyong}>
          <View style={styles.inline}>
            <Term k="the" label="Thể" style={styles.h3} />
            <Text style={styles.h3}> và </Text>
            <Term k="dung" label="Dụng" style={styles.h3} />
          </View>
          <Text style={styles.body}>
            Thể là <Text style={styles.bold}>{meihua.ti.symbol} {meihua.ti.name}</Text> (người hỏi), Dụng là{" "}
            <Text style={styles.bold}>
              {meihua.yong.symbol} {meihua.yong.name}
            </Text>{" "}
            (sự việc, chứa hào động {meihua.movingLine}).
          </Text>
          <View style={[styles.verdict, meihua.verdict.outcome === "cat" || meihua.verdict.outcome === "tieu-cat" ? styles.good : styles.bad]}>
            <Text style={[styles.bold, { color: meihua.verdict.outcome === "cat" || meihua.verdict.outcome === "tieu-cat" ? colors.good : colors.bad }]}>
              {meihua.verdict.label}
            </Text>
            <Text style={styles.body}>{meihua.verdict.explanation}</Text>
          </View>
          <WuxingCycle ti={meihua.ti.element} yong={meihua.yong.element} />
        </View>
      ) : null}

      {topic !== "general" && <TopicCard reading={reading} topic={topic} meihua={meihua} />}
      {topic !== "general" && <Text style={styles.explainHeading}>Giải thích chung</Text>}

      {sections.map((s) => (
        <View key={s.key} style={[styles.section, s.key === "guide" && styles.guide]}>
          {SECTION_TERM[s.key] ? <Term k={SECTION_TERM[s.key]!} label={s.title} style={styles.h3} /> : <Text style={styles.h3}>{s.title}</Text>}
          <Text style={styles.body}>{s.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  eyebrow: { fontSize: 11, letterSpacing: 1, color: colors.muted },
  question: { fontSize: 18, fontFamily: "serif", color: colors.fg },
  flow: { alignItems: "center", gap: 14 },
  arrow: { alignItems: "center" },
  arrowText: { color: colors.accent, fontSize: 12 },
  arrowGlyph: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  still: { color: colors.muted, textAlign: "center" },
  tiyong: { gap: 8, padding: 12, borderRadius: 12, backgroundColor: colors.surface },
  inline: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  verdict: { padding: 10, borderRadius: 8, gap: 2 },
  good: { backgroundColor: colors.goodSoft },
  bad: { backgroundColor: colors.badSoft },
  section: { gap: 6, padding: 12, borderRadius: 12, backgroundColor: colors.surface },
  guide: { backgroundColor: colors.accentSoft },
  h3: { fontSize: 16, fontWeight: "700", fontFamily: "serif", color: colors.fg },
  body: { fontSize: 14.5, lineHeight: 21, color: colors.fg },
  bold: { fontWeight: "700" },
  explainHeading: { fontSize: 15, fontWeight: "700", color: colors.muted, fontFamily: "serif" },
});
