# cli
Real-world role: Node CLI engineer.
Owns: `src/**`, `test/**`, `package.json`, `README.md`.
Never touches: `teams/**`, `.github/**`, `CONVENTIONS.md`, `CONTEXT.md`, `AGENTS.md`.
Needs frozen from earlier passes: nothing.

Rules:
1. argv, file and stdin I/O live only in `src/cli.js`.
2. `src/count.js` stays pure: no I/O, no process access.
3. No dependencies; parse flags with `util.parseArgs`.
4. Invalid usage prints to stderr, exits 2, leaves stdout empty.
5. A missing file prints a one-line message to stderr and exits 1.

Green adds: `test/cli.test.js` spawns the CLI for each flag from both a file and stdin, plus invalid usage.

Verifier adds:
- Default output unchanged.
- Frequency held in a `Map`: a plain object breaks on `constructor` and `__proto__`.
- Deterministic tie order (code-unit).
- No new dependency.
- Terms match `CONTEXT.md`.
