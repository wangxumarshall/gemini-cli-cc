description: Perform an adversarial code review on local git changes
argument-hint: '[--wait|--background] [extra focus text]'
disable-model-invocation: true
allowed-tools: Bash(node:*), AskUserQuestion
---

Run an adversarial Gemini review.

Raw slash-command arguments:
`$ARGUMENTS`

Core constraint:
- This command is adversarial review-only. Do not fix issues yourself.
- Return the command stdout verbatim, exactly as-is.

Foreground flow:
- Run:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" adversarial-review "$ARGUMENTS"
```

Background flow:
- Launch with `Bash` in the background:
```typescript
Bash({
  command: `node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" adversarial-review "$ARGUMENTS"`,
  description: "Gemini adversarial review",
  run_in_background: true
})
```
