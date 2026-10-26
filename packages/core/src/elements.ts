import type { Element } from "./types";

export const ELEMENT_NAMES: Readonly<Record<Element, string>> = {
  kim: "Kim",
  moc: "Mộc",
  thuy: "Thủy",
  hoa: "Hỏa",
  tho: "Thổ",
};

/** Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc. */
const GENERATES: Readonly<Record<Element, Element>> = { moc: "hoa", hoa: "tho", tho: "kim", kim: "thuy", thuy: "moc" };
/** Tương khắc: Mộc → Thổ → Thủy → Hỏa → Kim → Mộc. */
const OVERCOMES: Readonly<Record<Element, Element>> = { moc: "tho", tho: "thuy", thuy: "hoa", hoa: "kim", kim: "moc" };

export function generates(a: Element, b: Element): boolean {
  return GENERATES[a] === b;
}

export function overcomes(a: Element, b: Element): boolean {
  return OVERCOMES[a] === b;
}

export type ElementRelation = "same" | "a-generates-b" | "b-generates-a" | "a-overcomes-b" | "b-overcomes-a";

export function elementRelation(a: Element, b: Element): ElementRelation {
  if (a === b) return "same";
  if (generates(a, b)) return "a-generates-b";
  if (generates(b, a)) return "b-generates-a";
  if (overcomes(a, b)) return "a-overcomes-b";
  return "b-overcomes-a";
}
