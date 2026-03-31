description: Show active and recent Gemini jobs for this workspace
argument-hint: '[job-id]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" status $ARGUMENTS`

If the user did not pass a job ID:
- Render the command output as a single Markdown table for past runs in this session.

If the user did pass a job ID:
- Present the full command output to the user verbatim.
