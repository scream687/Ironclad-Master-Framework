import { injectable } from 'inversify';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

@injectable()
export class SkillService {
  public async fetchSkill(repo: string): Promise<void> {
    const repoName = repo.split('/').pop() || 'unknown';
    const targetDir = path.join('.ai-core', 'skills', repoName);

    if (fs.existsSync(targetDir)) {
      throw new Error(`Skill already exists: ${targetDir}`);
    }

    const result = shell.exec(`gh repo clone ${repo} ${targetDir} -- --depth 1`, { silent: true });

    if (result.code !== 0) {
      throw new Error(`Failed to clone repository: ${repo}. Error: ${result.stderr}`);
    }
  }
}
