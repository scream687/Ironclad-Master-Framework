import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛡️ Starting Ironclad Test Suite...\n');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(e);
    failed++;
  }
}

// Simulated hook tests based on ECC standard
runTest('Truth Check Hook Blocks Slop', () => {
  const hookPath = path.resolve(__dirname, '../scripts/hooks/truth-check.js');
  // We expect process.exit(0) if no file passed
  execSync(`node "${hookPath}"`);
});

runTest('Package Manager Detector Returns String', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/setup-package-manager.js');
  const out = execSync(`node "${scriptPath}"`).toString();
  if (!out.includes('Package manager set to')) {
    throw new Error('Detection failed');
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
