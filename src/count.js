export function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function countLines(text) {
  throw new Error(`countLines not implemented: ${text.length}`);
}
