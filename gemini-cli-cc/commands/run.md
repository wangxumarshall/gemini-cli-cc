description: Delegate arbitrary task to the Gemini CLI agent
argument-hint: '[--background|--wait] [task description]'
disable-model-invocation: true
allowed-tools: Bash(node:*), AskUserQuestion
---

Route this request to the Gemini Agent.

Raw user request:
`$ARGUMENTS`

Execution mode:
- If `--background` is specified, run via `Bash(run_in_background: true)`.
- Otherwise, run in foreground.

Foreground flow:
- Run:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" task "$ARGUMENTS"
```
- Return the output verbatim to the user.

Background flow:
- Launch with `Bash` in the background:
```typescript
Bash({
  command: `node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" task "$ARGUMENTS"`,
  description: "Gemini task run",
  run_in_background: true
})
```
