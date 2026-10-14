/** Transparent lettering canvases share the same proportions for fair comparison. */
export const WORDMARK_OPTIONS = [
  { id: 1, name: "Reference 01", src: "/brand/wordmarks/wordmark-01.png" },
  { id: 2, name: "Reference 02", src: "/brand/wordmarks/wordmark-02.png" },
  { id: 3, name: "Reference Open", src: "/brand/wordmarks/wordmark-03.png" },
  { id: 4, name: "Reference Compact", src: "/brand/wordmarks/wordmark-04.png" },
  { id: 5, name: "Square", src: "/brand/wordmarks/wordmark-05.png" },
  { id: 6, name: "Chamfer", src: "/brand/wordmarks/wordmark-06.png" },
  { id: 7, name: "Orthogonal", src: "/brand/wordmarks/wordmark-07.png" },
  { id: 8, name: "Precision", src: "/brand/wordmarks/wordmark-08.png" },
  { id: 9, name: "Structural", src: "/brand/wordmarks/wordmark-09.png" },
  { id: 10, name: "Wide", src: "/brand/wordmarks/wordmark-10.png" },
] as const;

export type WordmarkId = (typeof WORDMARK_OPTIONS)[number]["id"];
export const DEFAULT_WORDMARK: WordmarkId = 2;
export const WORDMARK_WIDTH = 2400;
export const WORDMARK_HEIGHT = 320;

export function parseWordmark(value: string | null): WordmarkId | null {
  if (!value || !/^(?:[1-9]|10)$/.test(value)) return null;
  return Number(value) as WordmarkId;
}
