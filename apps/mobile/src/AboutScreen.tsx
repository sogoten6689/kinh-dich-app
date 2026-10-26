import { ABOUT, APP_INFO, GLOSSARY } from "@kinh-dich/core";
import { StyleSheet, Text, View } from "react-native";
import { Logo } from "./Logo";
import { colors } from "./theme";

export function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Logo size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.h2}>{APP_INFO.name}</Text>
          <Text style={styles.muted}>{ABOUT.intro}</Text>
        </View>
      </View>

      <Text style={styles.h3}>Kinh Dịch là gì?</Text>
      {ABOUT.whatIs.map((p) => (
        <Text key={p} style={styles.body}>
          {p}
        </Text>
      ))}

      <Text style={styles.h3}>Ứng dụng làm được gì</Text>
      {ABOUT.features.map(([title, text]) => (
        <Text key={title} style={styles.body}>
          • <Text style={styles.bold}>{title}</Text> {text}
        </Text>
      ))}

      <Text style={styles.h3}>Cách dùng</Text>
      {ABOUT.howTo.map((s, i) => (
        <Text key={s} style={styles.body}>
          {i + 1}. {s}
        </Text>
      ))}
      <Text style={styles.disclaimer}>{ABOUT.disclaimer}</Text>

      <View style={styles.author} accessibilityLabel="Tác giả">
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>LN</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>TÁC GIẢ</Text>
          <Text style={styles.h3}>{APP_INFO.author}</Text>
          <Text style={styles.muted}>{APP_INFO.organization}</Text>
        </View>
        <Text style={styles.muted}>v{APP_INFO.version}</Text>
      </View>

      <Text style={styles.h3}>Thuật ngữ</Text>
      {GLOSSARY.map((g) => (
        <View key={g.key} style={styles.term}>
          <Text style={styles.bold}>
            {g.term} <Text style={styles.muted}>{g.short}</Text>
          </Text>
          <Text style={styles.body}>{g.detail}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  hero: { flexDirection: "row", gap: 14, alignItems: "center" },
  h2: { fontSize: 24, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  h3: { fontSize: 18, fontFamily: "serif", fontWeight: "700", color: colors.fg, marginTop: 6 },
  muted: { color: colors.muted, lineHeight: 20 },
  body: { color: colors.fg, lineHeight: 22, fontSize: 15 },
  bold: { fontWeight: "700", color: colors.fg },
  disclaimer: { padding: 12, borderRadius: 8, backgroundColor: colors.warnSoft, color: colors.muted, lineHeight: 20 },
  author: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, marginTop: 6 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18, fontFamily: "serif" },
  eyebrow: { fontSize: 11, letterSpacing: 1, color: colors.accent, fontWeight: "700" },
  term: { padding: 12, borderRadius: 10, backgroundColor: colors.surface, gap: 4 },
});
