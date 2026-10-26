import { ABOUT, ELEMENT_NAMES, TRIGRAMS, TRIGRAM_ORDER, type Direction, type Trigram, type TrigramKey } from "@kinh-dich/core";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { colors, ELEMENT_COLOR } from "./theme";
import { WuxingCycle } from "./WuxingCycle";

type Arrangement = "late" | "early";

/** Cùng hình học với apps/web/src/components/BaguaView.tsx; phương Nam ở trên cùng. */
const ANGLE: Readonly<Record<Direction, number>> = {
  Nam: -90,
  "Tây Nam": -45,
  Tây: 0,
  "Tây Bắc": 45,
  Bắc: 90,
  "Đông Bắc": 135,
  Đông: 180,
  "Đông Nam": -135,
};
const C = 170;

function TrigramGlyph({ t, angle, color }: { t: Trigram; angle: number; color: string }) {
  const w = 44;
  const h = 6;
  const gap = 5;
  return (
    <G rotation={angle + 90} originX={0} originY={0}>
      {t.lines.map((bit, i) => {
        const y = (1 - i) * (h + gap) - h / 2;
        return bit === 1 ? (
          <Rect key={i} x={-w / 2} y={y} width={w} height={h} rx={1.5} fill={color} />
        ) : (
          <G key={i}>
            <Rect x={-w / 2} y={y} width={w / 2 - 4} height={h} rx={1.5} fill={color} />
            <Rect x={4} y={y} width={w / 2 - 4} height={h} rx={1.5} fill={color} />
          </G>
        );
      })}
    </G>
  );
}

export function BaguaScreen() {
  const [arr, setArr] = useState<Arrangement>("late");
  const [selected, setSelected] = useState<TrigramKey>("qian");
  const t = TRIGRAMS[selected];
  const dir = (k: TrigramKey) => (arr === "late" ? TRIGRAMS[k].direction : TRIGRAMS[k].earlyHeavenDirection);
  const octagon = Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 - 22.5) * Math.PI) / 180;
    return `${C + 125 * Math.cos(a)},${C + 125 * Math.sin(a)}`;
  }).join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Bát quái</Text>
      <Text style={styles.muted}>{ABOUT.bagua}</Text>
      <View style={styles.segmented} accessibilityRole="radiogroup">
        {(
          [
            ["late", "Hậu Thiên (Văn Vương)"],
            ["early", "Tiên Thiên (Phục Hy)"],
          ] as const
        ).map(([id, label]) => (
          <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: arr === id }} onPress={() => setArr(id)} style={[styles.seg, arr === id && styles.segActive]}>
            <Text style={[styles.segText, arr === id && styles.bold]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.wheel}>
        <Svg width="100%" height={340} viewBox="0 0 340 340">
          <Polygon points={octagon} fill={colors.surface} stroke={colors.line} strokeWidth={1.5} />
          <G x={C} y={C}>
            <Circle r={34} fill={colors.ink} />
            <Path d="M0 -34 A34 34 0 0 1 0 34 A17 17 0 0 1 0 0 A17 17 0 0 0 0 -34 Z" fill={colors.bg} />
            <Circle cy={-17} r={5} fill={colors.ink} />
            <Circle cy={17} r={5} fill={colors.bg} />
            <Circle r={34} fill="none" stroke={colors.ink} strokeWidth={1.5} />
          </G>
          {TRIGRAM_ORDER.map((k) => {
            const tr = TRIGRAMS[k];
            const a = ANGLE[dir(k)];
            const rad = (a * Math.PI) / 180;
            const gx = C + 98 * Math.cos(rad);
            const gy = C + 98 * Math.sin(rad);
            const lx = C + 148 * Math.cos(rad);
            const ly = C + 148 * Math.sin(rad);
            const on = selected === k;
            return (
              <G key={k} onPress={() => setSelected(k)}>
                <Circle cx={gx} cy={gy} r={30} fill={on ? colors.card : "transparent"} stroke={on ? colors.accent : "transparent"} strokeWidth={2} />
                <G x={gx} y={gy}>
                  <TrigramGlyph t={tr} angle={a} color={ELEMENT_COLOR[tr.element]} />
                </G>
                <SvgText x={lx} y={ly - 2} textAnchor="middle" fontSize="14" fontWeight="700" fill={colors.fg}>
                  {tr.name}
                </SvgText>
                <SvgText x={lx} y={ly + 12} textAnchor="middle" fontSize="11" fill={colors.muted}>
                  {dir(k)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      <View style={styles.chips}>
        {TRIGRAM_ORDER.map((k) => (
          <Pressable key={k} onPress={() => setSelected(k)} accessibilityRole="button" accessibilityLabel={`${TRIGRAMS[k].name} — ${TRIGRAMS[k].natureVi}`} style={[styles.chip, selected === k && styles.chipOn]}>
            <Text style={[styles.chipText, { color: ELEMENT_COLOR[TRIGRAMS[k].element] }]}>{TRIGRAMS[k].symbol}</Text>
            <Text style={styles.chipLabel}>{TRIGRAMS[k].name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.card, { borderTopColor: ELEMENT_COLOR[t.element] }]}>
        <View style={styles.cardHead}>
          <Text style={[styles.bigSym, { color: ELEMENT_COLOR[t.element] }]}>{t.symbol}</Text>
          <View>
            <Text style={styles.h3}>
              {t.name} <Text style={styles.muted}>{t.hanzi}</Text>
            </Text>
            <Text style={styles.muted}>
              {t.nature} — {t.natureVi}
            </Text>
          </View>
        </View>
        <Text style={styles.body}>{t.description}</Text>
        {(
          [
            ["Tính chất", t.quality],
            ["Ngũ hành", ELEMENT_NAMES[t.element]],
            ["Hậu Thiên", t.direction],
            ["Tiên Thiên", `${t.earlyHeavenDirection} · số ${t.earlyHeavenNumber}`],
            ["Gia đình", t.family],
            ["Con vật", t.animal],
            ["Cơ thể", t.body],
          ] as const
        ).map(([k, v]) => (
          <View key={k} style={styles.dl}>
            <Text style={[styles.muted, styles.dt]}>{k}</Text>
            <Text style={styles.body}>{v}</Text>
          </View>
        ))}
      </View>

      <View style={styles.wuxing}>
        <Text style={styles.h3}>Ngũ hành</Text>
        <Text style={styles.body}>{ABOUT.wuxing} Màu của các quẻ phía trên theo màu hành của chúng.</Text>
        <WuxingCycle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  h2: { fontSize: 24, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  h3: { fontSize: 18, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  muted: { color: colors.muted, lineHeight: 20 },
  body: { color: colors.fg, lineHeight: 21, flexShrink: 1 },
  bold: { fontWeight: "700" },
  segmented: { flexDirection: "row", gap: 4, backgroundColor: colors.surface, padding: 4, borderRadius: 999 },
  seg: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: "center" },
  segActive: { backgroundColor: colors.card },
  segText: { fontSize: 13, color: colors.fg },
  wheel: { alignItems: "center" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  chipOn: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  chipText: { fontSize: 18 },
  chipLabel: { color: colors.fg, fontSize: 13 },
  card: { gap: 10, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderTopWidth: 5 },
  cardHead: { flexDirection: "row", gap: 14, alignItems: "center" },
  bigSym: { fontSize: 52, lineHeight: 58 },
  dl: { flexDirection: "row", gap: 12 },
  dt: { width: 84 },
  wuxing: { gap: 10, padding: 16, borderRadius: 16, backgroundColor: colors.surface },
});
