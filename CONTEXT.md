# CONTEXT

`wordstat` is a small Node command-line tool that reports statistics about one text input.

- **Input**: the text `wordstat` reads, from the file named on the command line or from stdin when none is named.
- **Word**: a run of non-whitespace characters in the input.
- **Line**: a line of the input.
- **Word count**: the number of words in the input; the default output.
- **Line count**: the number of lines in the input.
- **Frequency**: how many times a word occurs in the input.
- **Top list**: the `n` most frequent words, one per line as `<count> <word>`, ties broken in code-unit order.
- **Flag**: a command-line option such as `--lines` or `--top <n>`.
