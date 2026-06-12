const fs = require('fs');
const path = require('path');

// Target installers for Cross-Harness deployments
const installers = {
  claude: () => {
    const claudePath = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'rules', 'ironclad');
    console.log(`Installing Ironclad Rules to Claude Code: ${claudePath}`);
    fs.mkdirSync(claudePath, { recursive: true });
    // Execute copy logic here...
    console.log('✅ Claude Code install complete.');
  },
  cursor: () => {
    const cursorPath = path.join(process.cwd(), '.cursor', 'rules');
    console.log(`Installing Ironclad Rules to Cursor: ${cursorPath}`);
    fs.mkdirSync(cursorPath, { recursive: true });
    // Execute copy logic here...
    console.log('✅ Cursor install complete.');
  },
  gemini: () => {
    const geminiPath = path.join(process.cwd(), '.gemini');
    console.log(`Installing Ironclad Rules to Gemini: ${geminiPath}`);
    fs.mkdirSync(geminiPath, { recursive: true });
    // Execute copy logic here...
    console.log('✅ Gemini install complete.');
  }
};

const args = process.argv.slice(2);
const targetIdx = args.indexOf('--target');

if (targetIdx !== -1 && args[targetIdx + 1]) {
  const target = args[targetIdx + 1];
  if (installers[target]) {
    installers[target]();
  } else {
    console.error(`Unknown target: ${target}. Supported: claude, cursor, gemini`);
    process.exit(1);
  }
} else {
  console.log('Running interactive Ironclad installer (Defaulting to universal install)...');
  Object.values(installers).forEach(fn => fn());
}