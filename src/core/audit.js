import chalk from 'chalk';
import ora from 'ora';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

export async function auditAction() {
  const spinner = ora('Initializing Ironclad Audit...').start();
  
  let exitCode = 0;

  // 1. Logs Check
  spinner.text = 'Checking for unauthorized logs...';
  const logFiles = shell.find(['src', 'docs', 'scripts']).filter(file => {
    return file.match(/\.(js|ts|sh|md)$/) && !file.includes('node_modules') && !file.includes('.ai-core');
  });

  let foundLogs = [];
  logFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('console.log') && !file.includes('audit.js') && !file.includes('upgrade.js') && !file.includes('ironclad.js')) {
      foundLogs.push(file);
    }
  });

  if (foundLogs.length > 0) {
    spinner.fail(chalk.red('Found console.log in unauthorized files:'));
    foundLogs.forEach(f => console.log(`  - ${f}`));
    exitCode = 1;
  } else {
    spinner.succeed(chalk.green('No unauthorized logs found.'));
  }

  // 2. TODO Check
  spinner.start('Checking for incomplete SPARC cycles (TODOs)...');
  const allFiles = shell.find('.').filter(file => {
    return file.match(/\.(js|ts|sh|md|sql)$/) && 
           !file.includes('node_modules') && 
           !file.includes('.ai-core') && 
           !file.includes('.husky') && 
           !file.includes('README.md') &&
           !file.includes('.next');
  });

  let foundTodos = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('// TODO') && !file.includes('audit.js') && !file.includes('upgrade.js')) {
      foundTodos.push(file);
    }
  });

  if (foundTodos.length > 0) {
    spinner.fail(chalk.red('Found incomplete SPARC cycles (TODOs):'));
    foundTodos.forEach(f => console.log(`  - ${f}`));
    exitCode = 1;
  } else {
    spinner.succeed(chalk.green('All SPARC cycles complete.'));
  }

  // 3. Directory Integrity
  spinner.start('Verifying directory integrity...');
  const requiredDirs = ['.ai-core/rules', '.ai-core/skills', 'plans', 'docs', 'scripts', 'bin', 'src/core'];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      spinner.fail(chalk.red(`Missing mandatory directory: ${dir}`));
      exitCode = 1;
    }
  }
  if (exitCode === 0) spinner.succeed(chalk.green('Directory structure verified.'));

  // 4. Rule Synchronization
  spinner.start('Verifying rule file synchronization...');
  const requiredRules = ['.clinerules', '.cursorrules', '.windsurfrules', 'CLAUDE.md', 'GEMINI.md', 'SKILL_ROUTER.md'];
  for (const file of requiredRules) {
    if (!fs.existsSync(file)) {
      spinner.fail(chalk.red(`Missing mandatory rule file: ${file}`));
      exitCode = 1;
    }
  }
  if (exitCode === 0) spinner.succeed(chalk.green('Rule files verified.'));

  if (exitCode === 0) {
    console.log(`\n${chalk.hex('#C2512B').bold('✨ Ironclad Audit: SUCCESS. Codebase is elite.')}\n`);
  } else {
    console.log(`\n${chalk.bgRed.white.bold(' 💀 Ironclad Audit: FAILED. Please remediate the slop. ')}\n`);
    process.exit(1);
  }
}
