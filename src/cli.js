#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { countLines, countWords, topWords } from "./count.js";

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: { lines: { type: "boolean" }, top: { type: "string" } },
  });
} catch (error) {
  console.error(`wordstat: ${error.message}`);
  process.exit(2);
}

const { values, positionals } = parsed;
if (positionals.length > 1) {
  console.error("wordstat: expected at most one file");
  process.exit(2);
}

if (values.top !== undefined && (values.lines || !/^[1-9]\d*$/.test(values.top))) {
  console.error("wordstat: --top takes a positive integer and excludes --lines");
  process.exit(2);
}

const file = positionals[0];
let text;
try {
  text = readFileSync(file ?? 0, "utf8");
} catch (error) {
  console.error(`wordstat: ${error.message}`);
  process.exit(1);
}

if (values.top !== undefined) {
  for (const [word, n] of topWords(text, Number(values.top))) console.log(`${n} ${word}`);
} else console.log(values.lines ? countLines(text) : countWords(text));
