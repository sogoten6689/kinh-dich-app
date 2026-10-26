import type { Hexagram, LinePosition } from "@kinh-dich/core";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

const SIZES = {
  sm: { width: 64, height: 7, gap: 5, split: 8 },
  md: { width: 120, height: 13, gap: 9, split: 16 },
  lg: { width: 140, height: 15, gap: 10, split: 18 },
} as const;

interface Props {
  hexagram: Hexagram;
  changingLines?: readonly LinePosition[];
  title?: string;
  size?: keyof typeof SIZES;
  showTrigrams?: boolean;
  caption?: boolean;
  /** Hiện ký hiệu ○/× trên hào động (chỉ đúng với quẻ chủ). */
  marks?: boolean;
  onPress?: () => void;
}

/** Vẽ quẻ: hào thượng ở trên cùng, hào sơ ở dưới; hào hiện dần từ dưới lên. */
export function HexagramFigure({ hexagram, changingLines = [], title, size = "md", showTrigrams = false, caption = true, marks = true, onPress }: Props) {
  const s = SIZES[size];
  const anims = useRef(hexagram.lines.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((a) => a.setValue(0));
    Animated.stagger(
      90,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 420, useNativeDriver: true })),
    ).start();
  }, [hexagram.number, anims]);

  const rows = hexagram.lines.map((bit, i) => ({ bit, pos: (i + 1) as LinePosition })).reverse();
  const body = (
    <View style={styles.wrap}>
      {title && <Text style={styles.title}>{title.toUpperCase()}</Text>}
      <View style={styles.row}>
        <View style={{ width: s.width, gap: s.gap }}>
          {rows.map(({ bit, pos }) => {
            const changing = changingLines.includes(pos);
            const a = anims[pos - 1]!;
            const seg = [styles.segment, { backgroundColor: changing ? colors.accent : colors.ink }];
            return (
              <Animated.View
                key={pos}
                style={[styles.line, { height: s.height, gap: s.split, opacity: a, transform: [{ scaleX: a }] }]}
                accessibilityLabel={`Hào ${pos} ${bit === 1 ? "dương" : "âm"}${changing ? " động" : ""}`}
              >
                <View style={seg} />
                {bit === 0 && <View style={seg} />}
                {changing && marks && size !== "sm" && (
                  <View style={styles.markWrap} pointerEvents="none">
                    <Text style={styles.mark}>{bit === 1 ? "○" : "×"}</Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>
        {showTrigrams && (
          <View style={styles.brackets}>
            {[hexagram.upper, hexagram.lower].map((t, i) => (
              <View key={i} style={styles.bracket}>
                <Text style={styles.bracketName}>
                  {t.symbol} {t.name}
                </Text>
                <Text style={styles.small}>{t.natureVi}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {caption && (
        <View style={styles.caption}>
          <Text style={[styles.name, size === "sm" && styles.nameSm]} numberOfLines={2}>
            {hexagram.number}. {hexagram.fullName}
          </Text>
          <Text style={styles.small}>{hexagram.hanzi}</Text>
          <Text style={[styles.small, styles.center]} numberOfLines={2}>
            {hexagram.meaning}
          </Text>
        </View>
      )}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Quẻ ${hexagram.number} ${hexagram.fullName}`} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 6 },
  title: { fontSize: 11, letterSpacing: 1, color: colors.muted, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { flexDirection: "row" },
  segment: { flex: 1, borderRadius: 2 },
  markWrap: { position: "absolute", left: 0, right: 0, top: -4, bottom: -4, alignItems: "center", justifyContent: "center" },
  mark: { backgroundColor: colors.card, color: colors.accent, fontWeight: "700", fontSize: 12, width: 18, height: 18, borderRadius: 9, textAlign: "center", lineHeight: 18, overflow: "hidden" },
  brackets: { gap: 10 },
  bracket: { borderLeftWidth: 2, borderLeftColor: colors.line, paddingLeft: 8 },
  bracketName: { fontSize: 13, color: colors.fg },
  caption: { alignItems: "center", maxWidth: 170 },
  name: { fontWeight: "600", color: colors.fg, textAlign: "center" },
  nameSm: { fontSize: 12 },
  small: { fontSize: 11.5, color: colors.muted },
  center: { textAlign: "center" },
  pressable: { padding: 8, borderRadius: 12 },
  pressed: { backgroundColor: colors.card },
});
