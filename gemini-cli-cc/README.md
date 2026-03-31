# gemini-cli-cc

A Claude Code plugin that integrates the official Google Gemini CLI natively into Claude Code.

This plugin allows you to invoke the Gemini Agent without leaving your terminal, seamlessly passing your workspace context, git diffs, and project rules to the powerful Gemini models.

## Installation

1. Install the official Gemini CLI globally:
   ```bash
   npm install -g @google/gemini-cli
   ```
2. Install this plugin in Claude Code:
   ```bash
   /plugin marketplace add <your-username>/gemini-cli-cc
   /plugin install gemini
   /reload-plugins
   ```
3. Run the setup command:
   ```bash
   /gemini:setup
   ```

## Features

- `/gemini:review`: Perform a context-aware code review of your current Git changes.
- `/gemini:adversarial-review`: Perform an adversarial code review, looking for edge cases, security vulnerabilities, and subtle bugs.
- `/gemini:run`: Delegate an agentic task to Gemini CLI.
- `/gemini:setup`: Verify your installation and check your Gemini API Key configuration.

## Requirements

- Node.js environment
- Official Google `gemini-cli` installed globally
- A valid Gemini API Key (`GEMINI_API_KEY` environment variable) or Google OAuth login
