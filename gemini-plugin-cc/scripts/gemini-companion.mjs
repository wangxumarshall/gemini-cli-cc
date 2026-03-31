#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import os from "node:os";

// Directory to store jobs for /gemini:status
const JOBS_DIR = path.join(process.cwd(), ".claude-plugin", "gemini-jobs");

function ensureJobsDir() {
  if (!fs.existsSync(JOBS_DIR)) {
    fs.mkdirSync(JOBS_DIR, { recursive: true });
  }
}

function generateJobId() {
  return "job_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function runGeminiCommand(promptArg, isBackground = false) {
  // `gemini` executable
  const cmd = os.platform() === 'win32' ? 'gemini.cmd' : 'gemini';

  // Notice we avoid array strings passing and use explicit shell string building or argument arrays.
  // When using shell: true, spawnSync can be picky about arrays.
  const escapedPrompt = promptArg.replace(/"/g, '\\"');
  const fullCommand = `${cmd} -p "${escapedPrompt}"`;

  const result = spawnSync(fullCommand, {
    encoding: 'utf-8',
    stdio: isBackground ? 'pipe' : 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' } // Preserve colors if possible
  });

  return result;
}

function saveJob(jobId, kind, status, prompt, stdout, stderr, code) {
  ensureJobsDir();
  const job = {
    id: jobId,
    kind,
    status,
    prompt,
    stdout,
    stderr,
    exitCode: code,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(path.join(JOBS_DIR, `${jobId}.json`), JSON.stringify(job, null, 2));
}

function handleSetup(args) {
  console.log('--- 🚀 Gemini CLI Claude Code Plugin Setup ---');
  let installed = false;
  try {
    const whichCmd = os.platform() === 'win32' ? 'where gemini' : 'which gemini';
    const geminiPath = spawnSync(whichCmd, { encoding: 'utf-8', shell: true }).stdout.trim();
    if (geminiPath) {
      installed = true;
      console.log(`✅ Found Gemini CLI at: ${geminiPath}`);
      const version = spawnSync('gemini --version', { encoding: 'utf-8', shell: true }).stdout.trim();
      console.log(`✅ Gemini CLI Version: ${version || 'Verified'}`);
    }
  } catch (e) {}

  if (!installed) {
    console.log('⚠️ Gemini CLI is not installed locally or globally.');
    if (args.includes('--json')) {
      console.log(JSON.stringify({ available: false, missingTool: 'gemini' }));
      return;
    }
    console.log('Please run: npm install -g @google/gemini-cli');
  } else {
    if (args.includes('--json')) {
      console.log(JSON.stringify({ available: true }));
      return;
    }
  }

  if (process.env.GEMINI_API_KEY) {
    console.log('✅ Found GEMINI_API_KEY environment variable.');
  } else {
    console.log('⚠️ GEMINI_API_KEY is not set. The gemini CLI will prompt you in the browser on your first run, or set it via export GEMINI_API_KEY="...".');
  }
}

function handleTaskOrReview(kind, argsStr) {
  const argsList = argsStr.split(' ').filter(Boolean);
  const isBackground = argsList.includes('--background');

  const promptParts = argsList.filter(a => !a.startsWith('--'));
  let prompt = promptParts.join(' ');

  if (kind === 'review' && !prompt) {
    prompt = "Please perform a standard code review on my current git changes, focusing on best practices, maintainability, and clean code.";
  } else if (kind === 'adversarial-review' && !prompt) {
    prompt = "Perform an adversarial code review on the recent changes. Actively look for security vulnerabilities, logic flaws, missing edge cases, and performance regressions. Be strict and thorough.";
  }

  if (!prompt) {
    console.error("❌ No prompt provided.");
    process.exit(1);
  }

  const jobId = generateJobId();
  if (isBackground) {
    console.log(`Job ID: ${jobId}`);
    console.log(`Running in background. Use /gemini:status ${jobId} to check progress.`);
  }

  console.log(`\n🤖 Invoking Gemini (${kind})...\n---`);

  const result = runGeminiCommand(prompt, isBackground);

  const status = result.status === 0 ? "success" : "failed";
  saveJob(jobId, kind, status, prompt, result.stdout, result.stderr, result.status);

  if (isBackground) {
    console.log(`\n---`);
    console.log(`✅ Job ${jobId} finished in background. Run /gemini:status ${jobId} to view results.`);
  } else {
    console.log(`\n---`);
    if (result.status !== 0) {
      console.log(`⚠️ Gemini CLI exited with code ${result.status}.`);
      if (result.stderr) console.error(result.stderr);
    } else {
      console.log(`✅ ${kind} complete.`);
    }
  }
}

function handleStatus(args) {
  const jobId = args[0];
  ensureJobsDir();

  if (jobId && !jobId.startsWith('--')) {
    const jobPath = path.join(JOBS_DIR, `${jobId}.json`);
    if (!fs.existsSync(jobPath)) {
      console.error(`❌ Job ${jobId} not found.`);
      return;
    }
    const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
    console.log(`Job ID: ${job.id}`);
    console.log(`Kind: ${job.kind}`);
    console.log(`Status: ${job.status}`);
    console.log(`Exit Code: ${job.exitCode}`);
    console.log(`Timestamp: ${job.timestamp}`);
    console.log(`\n--- Prompt ---\n${job.prompt}`);
    console.log(`\n--- Output ---\n${job.stdout || "No standard output"}`);
    if (job.stderr) {
      console.log(`\n--- Errors ---\n${job.stderr}`);
    }
  } else {
    const files = fs.readdirSync(JOBS_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      console.log("No Gemini jobs found for this session/workspace.");
      return;
    }
    console.log("ID\t\tKIND\t\tSTATUS\t\tTIMESTAMP");
    console.log("-------------------------------------------------------------------------");
    files.forEach(f => {
      const job = JSON.parse(fs.readFileSync(path.join(JOBS_DIR, f), 'utf8'));
      console.log(`${job.id}\t${job.kind}\t${job.status}\t${job.timestamp}`);
    });
    console.log("\nRun `/gemini:status <job-id>` to see detailed output.");
  }
}

function handleStopGate() {
  console.log("Running final review gate before stop...");
  const prompt = "Please perform a final quick review of the changes I just made before I stop the session. Point out any obvious syntax errors, debug statements left behind, or unhandled promises.";
  const result = runGeminiCommand(prompt, true);
  if (result.status === 0 && result.stdout && result.stdout.trim().length > 50) {
    console.log("\n--- Gemini Pre-Stop Review ---");
    console.log(result.stdout);
    console.log("------------------------------\n");
  } else if (result.status !== 0) {
    console.log("⚠️ Failed to run pre-stop review via Gemini.");
    if (result.stderr) console.error(result.stderr);
    if (result.stdout) console.log(result.stdout);
  }
}

// Main Router
const command = process.argv[2];
const args = process.argv.slice(3);
const rawArgsStr = args.join(' ');

switch (command) {
  case 'setup':
    handleSetup(args);
    break;
  case 'review':
    handleTaskOrReview('review', rawArgsStr);
    break;
  case 'adversarial-review':
    handleTaskOrReview('adversarial-review', rawArgsStr);
    break;
  case 'task':
    handleTaskOrReview('task', rawArgsStr);
    break;
  case 'status':
    handleStatus(args);
    break;
  case 'stop-gate':
    handleStopGate();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
