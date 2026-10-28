import {
  ABOUT,
  ageInfo,
  CYCLE_THEMES,
  greeting,
  NUMBER_MEANINGS,
  numberLabel,
  numerologyReport,
  parseBirthDate,
  type Profile,
} from "@kinh-dich/core";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BirthChartGrid } from "./BirthChartGrid";
import { colors } from "./theme";

const pad = (n: number) => String(n).padStart(2, "0");

/** Cùng nội dung với apps/web/src/components/NumerologyView.tsx. */
export function NumerologyScreen({ profile, onSave, onClear }: { profile: Profile | null; onSave: (p: Profile) => void; onClear: () => void }) {
  const [name, setName] = useState(profile?.name ?? "");
  const [birth, setBirth] = useState(profile ? `${pad(profile.birth.day)}/${pad(profile.birth.month)}/${profile.birth.year}` : "");
  const [error, setError] = useState<string | null>(null);
  const now = new Date();

  function submit() {
    if (!name.trim()) {
      setError("Bạn cho mình biết họ tên nhé.");
      return;
    }
    const r = parseBirthDate(birth, now);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    onSave({ name: name.trim().replace(/\s+/g, " "), birth: r.date });
  }

  const report = profile ? numerologyReport(profile.name, profile.birth, now) : null;
  const age = profile ? ageInfo(profile.birth, now) : null;
  const life = report ? NUMBER_MEANINGS[report.lifePath]! : null;

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Thần số học</Text>
      <Text style={styles.muted}>{ABOUT.numerology}</Text>

      <View style={styles.form} accessibilityLabel="Hồ sơ của bạn">
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ví dụ: Nguyễn Văn An" placeholderTextColor={colors.muted} autoComplete="name" />
        <Text style={styles.label}>Ngày sinh (dương lịch)</Text>
        <TextInput
          style={styles.input}
          value={birth}
          onChangeText={setBirth}
          placeholder="15/08/1990"
          placeholderTextColor={colors.muted}
          keyboardType="numbers-and-punctuation"
          autoComplete="birthdate-full"
        />
        <Pressable onPress={submit} accessibilityRole="button" style={styles.btn}>
          <Text style={styles.btnText}>{profile ? "Cập nhật" : "Xem thần số học"}</Text>
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.small}>{ABOUT.privacy}</Text>
        {profile && (
          <Pressable onPress={onClear} accessibilityRole="button">
            <Text style={styles.link}>Xóa thông tin đã lưu</Text>
          </Pressable>
        )}
      </View>

      {profile && report && age && life && (
        <View style={styles.result} accessibilityLabel="Kết quả thần số học">
          <Text style={styles.hello}>{greeting(profile.name, now)}!</Text>
          <View style={styles.chips}>
            <Text style={styles.chip}>{age.age} tuổi</Text>
            <Text style={styles.chip}>Tuổi mụ {age.lunarAge}</Text>
            <Text style={styles.chip}>
              {age.canChi.name} · con {age.canChi.animal}
            </Text>
          </View>
          {age.tetNote && <Text style={styles.small}>{age.tetNote}</Text>}

          <View style={styles.lifeCard} accessibilityLabel="Số chủ đạo">
            <View style={styles.bigNumber}>
              <Text style={styles.bigLabel}>Số chủ đạo</Text>
              <Text style={styles.bigValue}>{numberLabel(report.lifePath)}</Text>
            </View>
            <Text style={styles.h3}>{life.title}</Text>
            <Text style={styles.body}>{life.summary}</Text>
            {(
              [
                ["Điểm mạnh", life.strengths],
                ["Thử thách", life.challenges],
                ["Công việc hợp", life.career],
                ["Tình cảm", life.love],
              ] as const
            ).map(([k, v]) => (
              <View key={k} style={styles.dl}>
                <Text style={[styles.small, styles.dt]}>{k}</Text>
                <Text style={styles.dd}>{v}</Text>
              </View>
            ))}
          </View>

          {[
            { label: "Số ngày sinh", hint: "Năng khiếu tự nhiên", n: report.birthDay },
            { label: "Số linh hồn", hint: "Mong muốn bên trong (nguyên âm)", n: report.name.soul },
            { label: "Số nhân cách", hint: "Ấn tượng với người khác (phụ âm)", n: report.name.personality },
            { label: "Số sứ mệnh", hint: "Tài năng và hướng đi (cả họ tên)", n: report.name.expression },
          ].map((c) => (
            <View key={c.label} style={styles.numCard}>
              <Text style={styles.badge}>{numberLabel(c.n)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{c.label}</Text>
                <Text style={styles.small}>{c.hint}</Text>
                <Text style={styles.body}>
                  {NUMBER_MEANINGS[c.n]!.title}: {NUMBER_MEANINGS[c.n]!.summary.charAt(0).toLowerCase() + NUMBER_MEANINGS[c.n]!.summary.slice(1)}
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.h3}>Chu kỳ của bạn</Text>
          {[
            { n: report.cycle.year, title: `Năm cá nhân ${now.getFullYear()}`, prefix: "Năm" },
            { n: report.cycle.month, title: `Tháng ${now.getMonth() + 1}`, prefix: "Tháng" },
            { n: report.cycle.day, title: "Hôm nay", prefix: "Ngày" },
          ].map((c) => (
            <View key={c.title} style={styles.numCard}>
              <Text style={styles.badge}>{c.n}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{c.title}</Text>
                <Text style={styles.small}>
                  {c.prefix} của {CYCLE_THEMES[c.n]}
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.h3}>Biểu đồ ngày sinh</Text>
          <Text style={styles.small}>
            Các chữ số trong {pad(profile.birth.day)}/{pad(profile.birth.month)}/{profile.birth.year} xếp vào lưới 3×3. Đường liền là mũi tên đầy (thế mạnh), đường đứt là mũi
            tên trống (điều cần rèn luyện).
          </Text>
          <View style={styles.chartWrap}>
            <BirthChartGrid chart={report.chart} />
          </View>
          {report.chart.arrows.map((a) => (
            <View key={a.key} style={[styles.arrow, styles.arrowFull]}>
              <Text style={styles.bold}>
                {a.name} ({a.key})
              </Text>
              <Text style={styles.body}>{a.meaning}</Text>
            </View>
          ))}
          {report.chart.emptyArrows.map((a) => (
            <View key={a.key} style={[styles.arrow, styles.arrowEmpty]}>
              <Text style={styles.bold}>
                {a.name} ({a.key})
              </Text>
              <Text style={styles.body}>{a.meaning}</Text>
            </View>
          ))}
          {report.chart.arrows.length + report.chart.emptyArrows.length === 0 && (
            <Text style={styles.body}>Biểu đồ của bạn không có mũi tên nào: các nét tính cách khá cân bằng.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  h2: { fontSize: 24, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  h3: { fontSize: 18, fontFamily: "serif", fontWeight: "700", color: colors.fg, marginTop: 4 },
  muted: { color: colors.muted, lineHeight: 20 },
  small: { fontSize: 12.5, color: colors.muted, lineHeight: 18 },
  body: { color: colors.fg, lineHeight: 21, fontSize: 14.5 },
  bold: { fontWeight: "700", color: colors.fg },
  form: { gap: 6, padding: 14, borderRadius: 16, backgroundColor: colors.surface },
  label: { fontSize: 13, color: colors.muted, marginTop: 4 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 8, padding: 11, color: colors.fg, fontSize: 16 },
  btn: { marginTop: 8, backgroundColor: colors.accent, padding: 12, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  error: { color: colors.bad },
  link: { color: colors.accent, fontWeight: "700", textDecorationLine: "underline" },
  result: { gap: 10 },
  hello: { fontSize: 22, fontFamily: "serif", fontWeight: "700", color: colors.fg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, color: colors.fg, overflow: "hidden" },
  lifeCard: { gap: 6, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "stretch" },
  bigNumber: { alignSelf: "center", width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.accent, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  bigLabel: { fontSize: 12, color: colors.muted },
  bigValue: { fontSize: 36, fontFamily: "serif", fontWeight: "700", color: colors.accent },
  dl: { flexDirection: "row", gap: 10 },
  dt: { width: 96 },
  dd: { flex: 1, color: colors.fg, lineHeight: 20 },
  numCard: { flexDirection: "row", gap: 12, padding: 12, borderRadius: 12, backgroundColor: colors.surface, alignItems: "flex-start" },
  badge: { minWidth: 44, height: 44, lineHeight: 44, borderRadius: 22, backgroundColor: colors.accent, color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 17, fontFamily: "serif", overflow: "hidden", paddingHorizontal: 6 },
  chartWrap: { alignItems: "center" },
  arrow: { padding: 10, borderRadius: 10, backgroundColor: colors.surface, gap: 2 },
  arrowFull: { borderLeftWidth: 4, borderLeftColor: colors.accent },
  arrowEmpty: { borderLeftWidth: 4, borderLeftColor: colors.muted, borderStyle: "dashed" },
});
