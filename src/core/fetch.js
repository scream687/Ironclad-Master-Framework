import chalk from 'chalk';
import ora from 'ora';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

export async function fetchAction(repo) {
  const spinner = ora(`Fetching external intelligence from GitHub: ${repo}...`).start();

  const repoName = repo.split('/').pop();
  const targetDir = path.join('.ai-core', 'skills', repoName);

  if (fs.existsSync(targetDir)) {
    spinner.fail(chalk.red(`Skill already exists: ${targetDir}`));
    process.exit(1);
  }

  spinner.text = `📥 Cloning ${repo} into ${targetDir}...`;
  const result = shell.exec(`gh repo clone ${repo} ${targetDir} -- --depth 1`, { silent: true });

  if (result.code !== 0) {
    spinner.fail(chalk.red(`Failed to clone repository: ${repo}`));
    console.error(result.stderr);
    process.exit(1);
  }

  spinner.succeed(chalk.green(`Skill integrated into intelligence hub: ${repoName}`));
}
