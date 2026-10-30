import { test } from "node:test";
import assert from "node:assert/strict";
import { countWords } from "../src/count.js";

test("counts words", () => {
  assert.equal(countWords("one two  three\nfour"), 4);
});

test("empty text has no words", () => {
  assert.equal(countWords("   "), 0);
});
