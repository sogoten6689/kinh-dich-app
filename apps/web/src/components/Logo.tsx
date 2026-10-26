/** Logo: ấn son vuông với quẻ Ly ☲ (Lửa — sáng tỏ). Nguồn: assets/brand/logo.svg. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Logo Kinh Dịch">
      <rect width="64" height="64" rx="14" fill="#a3361f" />
      <rect x="5" y="5" width="54" height="54" rx="10" fill="none" stroke="#fbf8f1" strokeOpacity=".35" strokeWidth="1.5" />
      <g fill="#fbf8f1">
        <rect x="14" y="16" width="36" height="7" rx="2" />
        <rect x="14" y="28.5" width="15" height="7" rx="2" />
        <rect x="35" y="28.5" width="15" height="7" rx="2" />
        <rect x="14" y="41" width="36" height="7" rx="2" />
      </g>
    </svg>
  );
}
