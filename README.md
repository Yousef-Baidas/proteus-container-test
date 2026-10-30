# proteus-container-test

A throwaway project for trying Proteus's container isolation.

`wordstat` prints the number of words in a file or in stdin.

```
node src/cli.js notes.txt
npm test
```

## Goal for the test run

Add two flags to `wordstat`:

- `--lines` prints the line count instead of the word count.
- `--top <n>` prints the `n` most frequent words, one per line as `<count> <word>`, ties broken alphabetically.
