# /gemini:setup

Verify your Gemini CLI installation and environment configuration.
If `gemini` is not found, it will attempt to install `@google/gemini-cli` globally for you.
It will also verify if you have an active Google OAuth session or a `GEMINI_API_KEY` set.

Usage:
/gemini:setup

Internal Execution:
`node dist/setup.js`
