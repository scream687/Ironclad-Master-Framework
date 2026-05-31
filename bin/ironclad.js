#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { auditAction } from '../src/core/audit.js';
import { upgradeAction } from '../src/core/upgrade.js';
import { fetchAction } from '../src/core/fetch.js';

const program = new Command();

const IRONCLAD_LOGO = `
  ${chalk.hex('#C2512B')('🛡️  IRONCLAD MASTER FRAMEWORK')}
  ${chalk.hex('#1C1C1C')('High-Performance AI Engineering Shell')}
  ${chalk.dim('----------------------------------------')}
`;

program
  .name('ironclad')
  .description('Autonomous Business Operating System Command Center')
  .version('1.1.0');

console.log(IRONCLAD_LOGO);

program
  .command('audit')
  .description('Perform elite anti-slop verification')
  .action(async () => {
    await auditAction();
  });

program
  .command('upgrade')
  .description('Trigger the Ironclad Evolution Engine')
  .action(async () => {
    await upgradeAction();
  });

program
  .command('fetch')
  .description('Integrate external intelligence from GitHub')
  .argument('<repo>', 'GitHub repository (user/repo)')
  .action(async (repo) => {
    await fetchAction(repo);
  });

program.parse(process.argv);
