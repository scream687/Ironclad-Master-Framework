#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliPath = path.resolve(__dirname, '../src/cli/index.ts');
const args = process.argv.slice(2);

spawnSync('npx', ['tsx', cliPath, ...args], { stdio: 'inherit' });
