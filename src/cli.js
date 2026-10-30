#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { countWords } from "./count.js";

const file = process.argv[2];
const text = file ? readFileSync(file, "utf8") : readFileSync(0, "utf8");
console.log(countWords(text));
