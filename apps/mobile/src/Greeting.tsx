import { ABOUT, dailyMessage, type Profile } from "@kinh-dich/core";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

/** Cùng nội dung với apps/web/src/components/Greeting.tsx. */
export function Greeting({ profile, onSetup }: { profile: Profile | null; onSetup: () => void }) {
  if (!profile) {
    return (
      <View style={[styles.box, styles.invite]}>
        <Text style={styles.muted}>{ABOUT.noProfile}</Text>
        <Pressable onPress={onSetup} accessibilityRole="button">
          <Text style={styles.link}>Nhập tên và ngày sinh</Text>
        </Pressable>
      </View>
    );
  }
  const m = dailyMessage(profile, new Date());
  return (
    <View style={styles.box} accessibilityLabel="Lời chào">
      <Text style={styles.hello}>{m.greeting}!</Text>
      <Text style={styles.body}>{m.line} Tĩnh tâm, nghĩ về điều bạn muốn hỏi rồi gieo quẻ nhé.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 4, padding: 14, borderRadius: 12, backgroundColor: colors.accentSoft },
  invite: { backgroundColor: colors.surface, gap: 8 },
  hello: { fontSize: 19, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  body: { color: colors.fg, lineHeight: 21 },
  muted: { color: colors.muted, lineHeight: 20 },
  link: { color: colors.accent, fontWeight: "700", textDecorationLine: "underline" },
});
