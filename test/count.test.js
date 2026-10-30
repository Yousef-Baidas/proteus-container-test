import { test } from "node:test";
import assert from "node:assert/strict";
import { countLines, countWords, topWords } from "../src/count.js";

test("counts words", () => {
  assert.equal(countWords("one two  three\nfour"), 4);
});

test("empty text has no words", () => {
  assert.equal(countWords("   "), 0);
});

test("counts lines, ignoring one trailing newline", () => {
  assert.equal(countLines("a\nb"), 2);
  assert.equal(countLines("a\nb\n"), 2);
  assert.equal(countLines(""), 0);
});

test("top words: frequency, then code-unit order, capped at n", () => {
  assert.deepEqual(topWords("b a b c", 2), [["b", 2], ["a", 1]]);
});
