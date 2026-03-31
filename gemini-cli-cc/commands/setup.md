description: Verify the Gemini CLI setup and local installation
argument-hint: ''
disable-model-invocation: true
allowed-tools: Bash(node:*), AskUserQuestion
---

Run:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-companion.mjs" setup $ARGUMENTS
```

If the result says Gemini CLI is not installed, use `AskUserQuestion` to ask the user if they'd like to install it via npm.
- If yes, run: `npm install -g @google/gemini-cli`
- Then rerun the setup script.
