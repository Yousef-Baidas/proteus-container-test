import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gateFiles = [
  ".github/workflows/proteus-gates.yml",
  ".github/workflows/proteus-trust.yml",
  "lefthook.yml",
];

test("gates installed", () => {
  const found = gateFiles.filter((file) => existsSync(join(root, file)));
  const hash = createHash("sha256");
  const texts = found.map((file) => readFileSync(join(root, file), "utf8"));
  texts.forEach((text) => hash.update(text));
  console.log(`${root} sha256:${hash.digest("hex").slice(0, 12)} ${found.length}/${gateFiles.length} gate files`);

  const problems = gateFiles.filter((file) => !found.includes(file)).map((file) => `${file} missing`);
  found.forEach((file, i) => {
    if (texts[i].includes("EDIT")) problems.push(`${file} still contains EDIT`);
  });

  // An empty npm cache keeps npx from finding an oxlint this project did not install.
  const env = { ...process.env, npm_config_cache: "/nonexistent" };
  const lint = spawnSync("npx", ["--no", "--", "oxlint"], { cwd: root, encoding: "utf8", env });
  if (lint.status !== 0) problems.push(`npx oxlint exited ${lint.status}: ${(lint.stdout + lint.stderr).trim().slice(-300)}`);

  assert.deepEqual(problems, []);
});
