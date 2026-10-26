import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CastScreen } from "./src/CastScreen";
import { HexagramListScreen } from "./src/HexagramListScreen";
import { colors } from "./src/theme";

type Tab = "cast" | "list";

export default function App() {
  const [tab, setTab] = useState<Tab>("cast");
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="auto" />
      <View style={styles.tabs}>
        {(["cast", "list"] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === "cast" ? "Gieo quẻ" : "64 quẻ"}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>{tab === "cast" ? <CastScreen /> : <HexagramListScreen />}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: "row", gap: 8, padding: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.accent, alignItems: "center" },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.fg },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  content: { padding: 16, gap: 16 },
});
