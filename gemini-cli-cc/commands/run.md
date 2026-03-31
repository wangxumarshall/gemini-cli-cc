# /gemini:run

Delegate an arbitrary agentic task to the Gemini CLI agent.
This is similar to a "rescue" operation, letting you tap into Google's latest model directly from your workspace.

Usage:
/gemini:run "Refactor the user authentication module, support OAuth2, and add comprehensive unit tests."

Internal Execution:
`node dist/run.js "Execute the following task: {{prompt}}"`
