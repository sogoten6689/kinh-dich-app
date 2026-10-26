import { glossaryEntry } from "@kinh-dich/core";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, type TextStyle } from "react-native";
import { colors } from "./theme";

/** Thuật ngữ có giải thích: chạm để mở/đóng lời giải thích bên dưới. */
export function Term({ k, label, style }: { k: string; label?: string; style?: TextStyle }) {
  const entry = glossaryEntry(k);
  const [open, setOpen] = useState(false);
  if (!entry) return <Text style={style}>{label}</Text>;
  return (
    <View>
      <Pressable onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.row}>
        <Text style={[styles.label, style]}>{label ?? entry.term}</Text>
        <Text style={styles.q}>?</Text>
      </Pressable>
      {open && (
        <View style={styles.pop}>
          <Text style={styles.popText}>
            <Text style={styles.bold}>{entry.term}</Text> — {entry.detail}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start" },
  label: { textDecorationLine: "underline", textDecorationStyle: "dotted", textDecorationColor: colors.muted },
  q: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.line, color: colors.muted, fontSize: 10, fontWeight: "700", textAlign: "center", lineHeight: 16, overflow: "hidden" },
  pop: { marginTop: 6, padding: 10, borderRadius: 8, backgroundColor: colors.fg },
  popText: { color: colors.bg, fontSize: 13, lineHeight: 19 },
  bold: { fontWeight: "700" },
});
