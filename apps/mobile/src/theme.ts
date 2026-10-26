import type { Element } from "@kinh-dich/core";

/** Bảng màu giống web (apps/web/src/styles.css, giao diện sáng). */
export const colors = {
  bg: "#fbf8f1",
  surface: "#f3ede1",
  card: "#fffdf8",
  fg: "#2b2118",
  muted: "#6f604f",
  line: "#ddd3c2",
  ink: "#2b2118",
  accent: "#a3361f",
  accentSoft: "#f2dcd3",
  good: "#2f6b3a",
  goodSoft: "#dcebdc",
  bad: "#9b2c1c",
  badSoft: "#f6d9d2",
  warnSoft: "#f5e7c4",
};

export const ELEMENT_COLOR: Readonly<Record<Element, string>> = {
  kim: "#a08443",
  moc: "#3f7d4a",
  thuy: "#2f5f8a",
  hoa: "#c0432a",
  tho: "#9a6b2f",
};

export const fonts = {
  serif: "serif",
};
