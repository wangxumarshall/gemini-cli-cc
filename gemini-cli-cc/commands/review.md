# /gemini:review

Perform a context-aware code review of your local git changes using the Google Gemini CLI.
It evaluates your code against best practices, edge cases, performance issues, and maintainability rules.
Any workspace context and your `GEMINI.md` file will be picked up automatically.

Usage:
/gemini:review [--background] [--model gemini-2.5-flash]

Internal Execution:
`node dist/run.js "Please perform a standard code review on my current git changes, focusing on best practices, maintainability, and clean code."`
