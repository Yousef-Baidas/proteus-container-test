export function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function topWords(text, n) {
  throw new Error(`not implemented: topWords(${text.length} chars, ${n})`);
}

export function countLines(text) {
  if (text === "") return 0;
  const lines = text.split("\n").length;
  return text.endsWith("\n") ? lines - 1 : lines;
}
