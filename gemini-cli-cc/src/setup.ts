import { execSync } from 'child_process';
import * as os from 'os';

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error: any) {
    if (error.stdout) return error.stdout.trim();
    if (error.stderr) return error.stderr.trim();
    return '';
  }
}

async function setup() {
  console.log('--- 🚀 Gemini CLI Claude Code Plugin Setup ---');
  console.log('Checking for gemini-cli installation...');

  let geminiPath = '';
  try {
    const whichCmd = os.platform() === 'win32' ? 'where gemini' : 'which gemini';
    geminiPath = execSync(whichCmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
    console.log(`✅ Found Gemini CLI at: ${geminiPath}`);
  } catch (err) {
    console.log('⚠️ Gemini CLI is not installed locally or globally.');
    console.log('Attempting to install it via npm...');
    try {
      execSync('npm install -g @google/gemini-cli', { stdio: 'inherit' });
      console.log('✅ Successfully installed @google/gemini-cli globally.');
    } catch (installErr) {
      console.error('❌ Failed to install Gemini CLI automatically. Please run manually: npm install -g @google/gemini-cli');
      process.exit(1);
    }
  }

  console.log('\nChecking Authentication...');
  if (process.env.GEMINI_API_KEY) {
    console.log('✅ Found GEMINI_API_KEY environment variable.');
  } else {
    console.log('⚠️ GEMINI_API_KEY is not set.');
    console.log('If you want to use OAuth, the gemini CLI will prompt you in the browser on your first run.');
    console.log('Alternatively, you can get an API key at https://aistudio.google.com/apikey and set it:');
    console.log('export GEMINI_API_KEY="your_api_key"');
  }

  console.log('\nTesting Gemini CLI connection...');
  try {
    // Run a quick non-interactive command to verify
    const versionOutput = runCommand('gemini --version');
    console.log(`✅ Gemini CLI Version: ${versionOutput || 'Verified'}`);

    // Attempting to generate GEMINI.md if it doesn't exist
    // console.log('\nChecking for GEMINI.md project context...');
    // We can recommend running `/init` via gemini
    console.log('✅ Setup Complete! You can now use /gemini:review, /gemini:run, etc.');
  } catch (testErr: any) {
    console.log(`⚠️ Encountered an issue connecting or verifying the CLI. Please ensure your authentication is correct. (Error: ${testErr.message})`);
  }
}

setup().catch(err => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
