import { ELEMENT_NAMES, generates, overcomes, type Element } from "@kinh-dich/core";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, G, Line, Marker, Path, Text as SvgText } from "react-native-svg";
import { colors, ELEMENT_COLOR } from "./theme";

/** Cùng hình học với apps/web/src/components/WuxingCycle.tsx. */
const ORDER: readonly Element[] = ["hoa", "tho", "kim", "thuy", "moc"];
const CX = 150;
const CY = 150;
const R = 92;
const NODE = 27;

function pos(e: Element, r = R) {
  const i = ORDER.indexOf(e);
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function edge(from: Element, to: Element) {
  const a = pos(from);
  const b = pos(to);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  return { x1: a.x + ux * NODE, y1: a.y + uy * NODE, x2: b.x - ux * (NODE + 4), y2: b.y - uy * (NODE + 4) };
}

/** Vòng ngũ hành: cung ngoài tương sinh, ngôi sao trong tương khắc; tô đậm quan hệ Thể – Dụng. */
export function WuxingCycle({ ti, yong, size = 280 }: { ti?: Element; yong?: Element; size?: number }) {
  const pairs = ORDER.flatMap((a) => ORDER.filter((b) => generates(a, b) || overcomes(a, b)).map((b) => [a, b] as const));
  const isActive = (a: Element, b: Element) => ti !== undefined && yong !== undefined && ((a === ti && b === yong) || (a === yong && b === ti));
  return (
    <View style={styles.wrap}>
      <Svg width={size} height={(size * 290) / 300} viewBox="0 0 300 290" accessibilityLabel="Vòng tương sinh tương khắc của ngũ hành">
        <Defs>
          <Marker id="wx" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <Path d="M0,0 L10,5 L0,10 z" fill={colors.muted} />
          </Marker>
          <Marker id="wxOn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <Path d="M0,0 L10,5 L0,10 z" fill={colors.accent} />
          </Marker>
        </Defs>
        {pairs.map(([a, b]) => {
          const on = isActive(a, b);
          const gen = generates(a, b);
          return (
            <Line
              key={`${a}-${b}`}
              {...edge(a, b)}
              stroke={on ? colors.accent : gen ? colors.muted : colors.line}
              strokeWidth={on ? 3 : 1.5}
              strokeDasharray={!on && !gen ? "4 4" : undefined}
              markerEnd={on ? "url(#wxOn)" : "url(#wx)"}
            />
          );
        })}
        {ORDER.map((e) => {
          const p = pos(e);
          const lp = pos(e, R + NODE + 16);
          const role = e === ti && e === yong ? "Thể · Dụng" : e === ti ? "Thể" : e === yong ? "Dụng" : "";
          return (
            <G key={e}>
              <Circle cx={p.x} cy={p.y} r={NODE} fill={ELEMENT_COLOR[e]} stroke={role ? colors.fg : colors.card} strokeWidth={3} opacity={role ? 1 : 0.85} />
              <SvgText x={p.x} y={p.y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">
                {ELEMENT_NAMES[e]}
              </SvgText>
              {role ? (
                <SvgText x={lp.x} y={lp.y + 4} textAnchor="middle" fill={colors.fg} fontSize="12" fontWeight="700">
                  {role}
                </SvgText>
              ) : null}
            </G>
          );
        })}
      </Svg>
      <View style={styles.legend}>
        <Text style={styles.key}>— Tương sinh</Text>
        <Text style={styles.key}>- - Tương khắc</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 4 },
  legend: { flexDirection: "row", gap: 16 },
  key: { fontSize: 12, color: colors.muted },
});
