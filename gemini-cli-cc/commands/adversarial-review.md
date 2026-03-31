# /gemini:adversarial-review

Perform an adversarial review of your local git changes.
This prompt explicitly focuses on security vulnerabilities, questioning assumptions, finding obscure edge cases, and uncovering subtle performance issues.

Usage:
/gemini:adversarial-review ["Your extra instructions"]

Internal Execution:
`node dist/run.js "Perform an adversarial code review on the recent changes. Actively look for security vulnerabilities, logic flaws, missing edge cases, and performance regressions. Be strict and thorough."`
