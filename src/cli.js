#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { countLines, countWords } from "./count.js";

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: { lines: { type: "boolean" } },
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

const file = positionals[0];
let text;
try {
  text = readFileSync(file ?? 0, "utf8");
} catch (error) {
  console.error(`wordstat: ${error.message}`);
  process.exit(1);
}

console.log(values.lines ? countLines(text) : countWords(text));
