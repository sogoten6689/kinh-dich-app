import { ABOUT, APP_INFO, buildInfoRows, GLOSSARY } from "@kinh-dich/core";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { mobileBuildInfo } from "./buildInfo";
import { Logo } from "./Logo";
import { QrCode } from "./QrCode";
import { colors } from "./theme";

export function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Logo size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.h2}>{APP_INFO.name}</Text>
          <Text style={styles.muted}>{ABOUT.intro}</Text>
          <Pressable onPress={() => Linking.openURL(APP_INFO.website)} accessibilityRole="link">
            <Text style={styles.muted}>
              Trang chính thức: <Text style={styles.link}>{APP_INFO.website.replace("https://", "")}</Text>
            </Text>
          </Pressable>
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

      <Text style={styles.h3}>Tải app điện thoại</Text>
      <Text style={styles.muted}>Bản Android (file APK) mới nhất. Đưa mã QR này cho người khác quét để cài, hoặc bấm nút bên dưới.</Text>
      <View style={styles.qrWrap}>
        <QrCode value={APP_INFO.androidDownload} label="Mã QR tải app Android" />
      </View>
      <Pressable onPress={() => Linking.openURL(APP_INFO.androidDownload)} accessibilityRole="link" style={styles.downloadBtn}>
        <Text style={styles.downloadText}>Tải app Android (APK)</Text>
      </Pressable>

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

      <Text style={styles.h3}>Thông tin bản đang chạy</Text>
      <View style={styles.info} accessibilityLabel="Thông tin bản đang chạy">
        {buildInfoRows(mobileBuildInfo()).map((r) => (
          <View key={r.label} style={styles.infoRow}>
            <Text style={[styles.muted, styles.infoLabel]}>{r.label}</Text>
            <Text style={styles.infoValue}>{r.value}</Text>
          </View>
        ))}
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
  link: { color: colors.accent, fontWeight: "700" },
  qrWrap: { alignSelf: "flex-start", padding: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: "#ffffff" },
  downloadBtn: { alignSelf: "flex-start", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accent },
  downloadText: { color: "#fff", fontWeight: "700" },
  info: { padding: 14, borderRadius: 10, backgroundColor: colors.surface, gap: 6 },
  infoRow: { flexDirection: "row", gap: 12 },
  infoLabel: { width: 110 },
  infoValue: { flex: 1, color: colors.fg },
  term: { padding: 12, borderRadius: 10, backgroundColor: colors.surface, gap: 4 },
});
