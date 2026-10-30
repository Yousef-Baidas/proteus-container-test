# proteus-container-test

A throwaway project for trying Proteus's container isolation.

`wordstat` prints the number of words in a file or in stdin.

```
node src/cli.js notes.txt
npm test
```

## Flags

- `--lines` prints the line count instead of the word count.
- `--top <n>` prints the `n` most frequent words, one per line as `<count> <word>`.
  Words are whitespace-separated and case-sensitive, punctuation kept; ties
  are in code-unit order. If `n` exceeds the distinct word count, fewer lines print.

Invalid usage prints to stderr, exits 2 and prints nothing to stdout: an
unknown flag, more than one file, `--top` without a value or with anything but
a positive integer (`0`, `-1`, `1.5`, `5abc`), and `--lines` together with
`--top`. A missing file prints one line to stderr and exits 1.

## Goal for the test run

Add two flags to `wordstat`:

- `--lines` prints the line count instead of the word count.
- `--top <n>` prints the `n` most frequent words, one per line as `<count> <word>`, ties in code-unit order.
