import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

/**
 * Đồng tiền cổ lỗ vuông. Mặt ngửa (chữ) = 3, mặt sấp (trơn) = 2. Lật và nảy lên khi gieo.
 * Chỉ vẽ mặt kết quả và xoay đủ 4 vòng, nên không phụ thuộc backfaceVisibility (không ổn định giữa các nền tảng).
 */
export function Coin({ heads, delay = 0, spinKey }: { heads: boolean; delay?: number; spinKey: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    t.setValue(0);
    Animated.timing(t, { toValue: 1, duration: 900, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [spinKey, delay, t]);

  const rotateY = t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "1440deg"] });
  const translateY = t.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, -34, 0] });

  return (
    <View style={styles.wrap} accessibilityLabel={heads ? "Ngửa, 3" : "Sấp, 2"}>
      <Animated.View style={[styles.face, heads ? styles.front : styles.back, { transform: [{ perspective: 600 }, { translateY }, { rotateY }] }]}>
        {heads && <Text style={styles.glyph}>通</Text>}
        <View style={styles.hole} />
        {heads && <Text style={styles.glyph}>寶</Text>}
      </Animated.View>
      <Text style={styles.value}>{heads ? 3 : 2}</Text>
    </View>
  );
}

const SIZE = 66;
const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 6 },
  face: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#7a5a20",
  },
  front: { backgroundColor: "#c99d48" },
  back: { backgroundColor: "#b28a45" },
  hole: { width: 18, height: 18, backgroundColor: colors.surface, borderWidth: 2, borderColor: "#7a5a20", marginVertical: 1 },
  glyph: { fontSize: 13, fontWeight: "700", color: "#5b3f12", lineHeight: 15 },
  value: { fontWeight: "600", color: colors.muted, fontSize: 13 },
});
