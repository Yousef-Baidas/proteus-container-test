import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { countLines, topWords } from "../src/count.js";

const cli = fileURLToPath(new URL("../src/cli.js", import.meta.url));

const count = fileURLToPath(new URL("../src/count.js", import.meta.url));

const lineCases = [
  ["a\nb", 2],
  ["a\nb\n", 2],
  ["a b\nc d\n", 2],
  ["", 0],
];

const topCases = [
  ["ties in code-unit order", "pear apple Zebra pear apple Zebra", 3, [["Zebra", 2], ["apple", 2], ["pear", 2]]],
  ["ties by code unit, not code point", "～ \u{1f600}", 2, [["\u{1f600}", 1], ["～", 1]]],
  ["most frequent first", "c b b a a a", 2, [["a", 3], ["b", 2]]],
  ["case variants stay apart", "the The THE the", 3, [["the", 2], ["THE", 1], ["The", 1]]],
  ["punctuation kept", "end end. end", 2, [["end", 2], ["end.", 1]]],
  ["any whitespace splits", "a\tb\n  a\n", 2, [["a", 2], ["b", 1]]],
  ["prototype names are words", "__proto__ constructor __proto__ constructor toString __proto__", 3, [["__proto__", 3], ["constructor", 2], ["toString", 1]]],
  ["n above distinct count", "b a", 5, [["a", 1], ["b", 1]]],
  ["no words", "", 3, []],
];

const invalidTopArgs = [
  ["--top", "0"],
  ["--top", "-1"],
  ["--top", "1.5"],
  ["--top", "5abc"],
  ["--top", "notes.txt"],
  ["--top"],
  ["--lines", "--top", "1"],
];

function run(args, input = "") {
  return spawnSync(process.execPath, [cli, ...args], { encoding: "utf8", input });
}

async function runWithStdinHeldOpen(args) {
  const child = spawn(process.execPath, [cli, ...args], { timeout: 3000 });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => (stdout += chunk));
  child.stderr.on("data", (chunk) => (stderr += chunk));

  const [status] = await once(child, "close");

  return { status, stdout, stderr };
}

test("lines", async (t) => {
  const hash = createHash("sha256").update(readFileSync(cli)).update(readFileSync(count));
  console.log(`${cli} sha256:${hash.digest("hex").slice(0, 12)} ${lineCases.length} line cases`);

  const dir = mkdtempSync(join(tmpdir(), "wordstat-"));
  t.after(() => rmSync(dir, { recursive: true }));

  for (const [index, [text, expected]] of lineCases.entries()) {
    const file = join(dir, `lines-${index}.txt`);
    writeFileSync(file, text);
    const name = JSON.stringify(text);

    await t.test(`countLines ${name}`, () => {
      assert.equal(countLines(text), expected);
    });

    await t.test(`--lines ${name} by file`, () => {
      const result = run(["--lines", file]);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, `${expected}\n`);
    });

    await t.test(`--lines ${name} by stdin`, () => {
      const result = run(["--lines"], text);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, `${expected}\n`);
    });
  }

  await t.test("two file arguments exit 2", () => {
    const first = join(dir, "first.txt");
    const second = join(dir, "second.txt");
    writeFileSync(first, "a\n");
    writeFileSync(second, "b\n");
    const result = run([first, second]);
    assert.equal(result.status, 2, `two files must exit 2, got ${result.status}`);
    assert.equal(result.stdout, "");
    assert.notEqual(result.stderr, "");
  });

  await t.test("unknown flag exits 2 without reading input", async () => {
    const result = await runWithStdinHeldOpen(["--bogus"]);
    assert.equal(result.status, 2, "exit status");
    assert.equal(result.stdout, "");
    assert.notEqual(result.stderr, "");
  });

  await t.test("unknown flag wins over a missing file", () => {
    const result = run(["--bogus", join(dir, "absent.txt")]);
    assert.equal(result.status, 2, "exit status");
    assert.equal(result.stdout, "");
  });

  await t.test("missing file exits 1 with one stderr line", () => {
    const result = run(["--lines", join(dir, "absent.txt")]);
    assert.equal(result.status, 1, "exit status");
    assert.equal(result.stdout, "");
    assert.equal(result.stderr.trimEnd().split("\n").length, 1, result.stderr);
    assert.doesNotMatch(result.stderr, /^\s*at /m);
  });

  await t.test("default word count unchanged", () => {
    const file = join(dir, "words.txt");
    writeFileSync(file, "one two  three\nfour\n");
    assert.equal(run([file]).stdout, "4\n");
    assert.equal(run([], "one two  three\nfour\n").stdout, "4\n");
  });
});

test("top", async (t) => {
  const hash = createHash("sha256").update(readFileSync(cli)).update(readFileSync(count));
  console.log(
    `${cli} sha256:${hash.digest("hex").slice(0, 12)} ${topCases.length} top cases ${invalidTopArgs.length} invalid cases`,
  );

  const dir = mkdtempSync(join(tmpdir(), "wordstat-"));
  t.after(() => rmSync(dir, { recursive: true }));

  for (const [index, [name, text, n, expected]] of topCases.entries()) {
    const file = join(dir, `top-${index}.txt`);
    writeFileSync(file, text);
    const stdout = expected.map(([word, frequency]) => `${frequency} ${word}\n`).join("");

    await t.test(`topWords ${name}`, () => {
      assert.deepEqual(topWords(text, n), expected);
    });

    await t.test(`--top ${n} ${name} by file`, () => {
      const result = run(["--top", String(n), file]);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, stdout);
    });

    await t.test(`--top ${n} ${name} by stdin`, () => {
      const result = run(["--top", String(n)], text);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, stdout);
    });
  }

  for (const args of invalidTopArgs) {
    await t.test(`${args.join(" ")} exits 2 without reading input`, async () => {
      const result = await runWithStdinHeldOpen(args);
      assert.equal(result.status, 2, "exit status");
      assert.equal(result.stdout, "");
      assert.notEqual(result.stderr, "");
    });
  }
});
