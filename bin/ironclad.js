#!/usr/bin/env node

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entryPoint = path.resolve(__dirname, '../src/cli/index.ts');

const result = spawnSync('npx', ['tsx', entryPoint, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true
});

process.exit(result.status ?? 0);
