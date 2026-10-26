import type { Element } from "@kinh-dich/core";

/** Biến CSS màu cho từng hành (định nghĩa trong styles.css cho cả hai giao diện sáng/tối). */
export const ELEMENT_COLOR: Readonly<Record<Element, string>> = {
  kim: "var(--el-kim)",
  moc: "var(--el-moc)",
  thuy: "var(--el-thuy)",
  hoa: "var(--el-hoa)",
  tho: "var(--el-tho)",
};
