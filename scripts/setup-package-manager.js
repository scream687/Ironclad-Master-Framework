import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function detectPackageManager() {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm'; // default
}

const pm = detectPackageManager();
console.log(`[Ironclad] Detected package manager: ${pm}`);

// Save to config for harnesses to use
const configPath = path.join(process.cwd(), '.ironclad-pm.json');
fs.writeFileSync(configPath, JSON.stringify({ packageManager: pm }, null, 2));

console.log(`✅ Package manager set to ${pm}`);
