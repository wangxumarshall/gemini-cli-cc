import { spawn } from 'child_process';

async function runGemini() {
  const args = process.argv.slice(2);
  let prompt = args[0] || '';

  if (!prompt) {
    console.error('❌ No prompt provided for Gemini.');
    process.exit(1);
  }

  const fullPrompt = args.join(' ');

  console.log(`🤖 Invoking Gemini CLI: gemini -p "${fullPrompt}"\n---`);

  // Use shell parameter properly so `-p` and `fullPrompt` act as a single flag + value combination.
  // Note: Gemini throws if there's BOTH a positional prompt and a `-p` flag. So we ONLY use the flag.
  // We use `shell: true` and pass the exact command string instead to avoid string splitting issues:
  const command = `gemini -p "${fullPrompt.replace(/"/g, '\\"')}"`;

  const child = spawn(command, {
    stdio: 'inherit',
    shell: true,
    env: process.env // Inherit all env vars including GEMINI_API_KEY and workspace info
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start Gemini CLI: ${err.message}`);
    console.error('Please make sure it is installed and in your PATH. Try running `/gemini:setup`.');
  });

  child.on('close', (code) => {
    console.log('\n---');
    if (code !== 0) {
      console.log(`⚠️ Gemini CLI exited with code ${code}.`);
    } else {
      console.log('✅ Gemini execution complete.');
    }
    process.exit(code || 0);
  });
}

runGemini().catch(err => {
  console.error('❌ Run failed:', err);
  process.exit(1);
});
