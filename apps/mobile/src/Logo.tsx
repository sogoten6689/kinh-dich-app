import Svg, { G, Rect } from "react-native-svg";

/** Logo: ấn son vuông với quẻ Ly ☲. Nguồn: assets/brand/logo.svg. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Logo Kinh Dịch">
      <Rect width="64" height="64" rx="14" fill="#a3361f" />
      <Rect x="5" y="5" width="54" height="54" rx="10" fill="none" stroke="#fbf8f1" strokeOpacity={0.35} strokeWidth="1.5" />
      <G fill="#fbf8f1">
        <Rect x="14" y="16" width="36" height="7" rx="2" />
        <Rect x="14" y="28.5" width="15" height="7" rx="2" />
        <Rect x="35" y="28.5" width="15" height="7" rx="2" />
        <Rect x="14" y="41" width="36" height="7" rx="2" />
      </G>
    </Svg>
  );
}
