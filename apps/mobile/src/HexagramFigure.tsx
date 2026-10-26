import type { Hexagram, LinePosition } from "@kinh-dich/core";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

interface Props {
  hexagram: Hexagram;
  changingLines?: readonly LinePosition[];
  title?: string;
}

/** Vẽ quẻ: hào thượng ở trên cùng, hào sơ ở dưới cùng. */
export function HexagramFigure({ hexagram, changingLines = [], title }: Props) {
  const rows = hexagram.lines.map((bit, i) => ({ bit, pos: (i + 1) as LinePosition })).reverse();
  return (
    <View style={styles.figure}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.lines}>
        {rows.map(({ bit, pos }) => {
          const segment = [styles.segment, changingLines.includes(pos) && styles.changing];
          return (
            <View key={pos} style={styles.line}>
              <View style={segment} />
              {bit === 0 && <View style={segment} />}
            </View>
          );
        })}
      </View>
      <Text style={styles.name}>
        {hexagram.number}. {hexagram.fullName} {hexagram.hanzi}
      </Text>
      <Text style={styles.meaning}>{hexagram.meaning}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  figure: { alignItems: "center", marginVertical: 8 },
  title: { color: colors.muted, marginBottom: 6 },
  lines: { width: 120, gap: 8 },
  line: { flexDirection: "row", gap: 16, height: 12 },
  segment: { flex: 1, backgroundColor: colors.fg, borderRadius: 2 },
  changing: { backgroundColor: colors.accent },
  name: { color: colors.fg, fontWeight: "600", marginTop: 8 },
  meaning: { color: colors.muted },
});
