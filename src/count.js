export function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function topWords(text, n) {
  const freq = new Map();
  for (const word of text.split(/\s+/).filter(Boolean)) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return [...freq]
    .sort(([a, x], [b, y]) => y - x || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, n);
}

export function countLines(text) {
  if (text === "") return 0;
  const lines = text.split("\n").length;
  return text.endsWith("\n") ? lines - 1 : lines;
}
