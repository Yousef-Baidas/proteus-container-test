# CONVENTIONS

## Naming
- Files: lowercase, `count.js`.
- Functions and variables: camelCase, `countWords`.

## Layout
- Source in `src/`, tests in `test/`.
- Modules use named exports; no barrel files.

## Style
- ESM with `.js` extensions on relative imports: `./count.js`.
- `node:` prefix on built-in imports: `node:fs`.
- Double quotes, semicolons, 2-space indent.

## Errors
- Invalid CLI usage: message on stderr, exit 2.

## Comments
- None unless a line cannot explain itself.

## Tests
- `node:test` with `node:assert/strict`, run by `npm test`.
- File naming: `test/<name>.test.js`.

## Types
- Plain JavaScript; no TypeScript.

## Dependencies
- No runtime dependencies. The human approves every new dependency.

## Commits
- Conventional Commits, with no AI attribution trailer.
