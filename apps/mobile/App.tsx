import { APP_INFO } from "@kinh-dich/core";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AboutScreen } from "./src/AboutScreen";
import { BaguaScreen } from "./src/BaguaScreen";
import { CastScreen } from "./src/CastScreen";
import { LibraryScreen } from "./src/LibraryScreen";
import { Logo } from "./src/Logo";
import { colors } from "./src/theme";

/** Bốn tab giống web: Gieo quẻ · 64 quẻ · Bát quái · Giới thiệu. */
const TABS = [
  { id: "cast", label: "Gieo quẻ" },
  { id: "library", label: "64 quẻ" },
  { id: "bagua", label: "Bát quái" },
  { id: "about", label: "Giới thiệu" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<Tab>("cast");
  const scroll = useRef<ScrollView>(null);
  const scrollTop = () => scroll.current?.scrollTo({ y: 0, animated: true });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Logo size={34} />
        <View>
          <Text style={styles.brand}>{APP_INFO.name}</Text>
          <Text style={styles.tagline}>{APP_INFO.tagline}</Text>
        </View>
      </View>
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t.id }}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => {
              setTab(t.id);
              scrollTop();
            }}
          >
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === "cast" && <CastScreen />}
        {tab === "library" && <LibraryScreen onScrollTop={scrollTop} />}
        {tab === "bagua" && <BaguaScreen />}
        {tab === "about" && <AboutScreen />}
        <Text style={styles.footer}>
          {APP_INFO.name} · {APP_INFO.author} — {APP_INFO.organization} · Nội dung mang tính tham khảo văn hóa
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 12 },
  brand: { fontSize: 20, fontWeight: "700", fontFamily: "serif", color: colors.fg },
  tagline: { fontSize: 11.5, color: colors.muted },
  tabs: { flexDirection: "row", gap: 4, margin: 16, marginBottom: 4, padding: 4, borderRadius: 999, backgroundColor: colors.surface },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: "center" },
  tabActive: { backgroundColor: colors.card },
  tabText: { color: colors.muted, fontSize: 13 },
  tabTextActive: { color: colors.fg, fontWeight: "700" },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  footer: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 8 },
});
