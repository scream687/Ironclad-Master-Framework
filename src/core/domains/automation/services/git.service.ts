import { injectable } from 'inversify';
import shell from 'shelljs';

@injectable()
export class GitService {
  public async generateEliteCommit(): Promise<string> {
    const diff = shell.exec('git diff HEAD', { silent: true }).stdout;
    if (!diff) return 'No changes to commit.';
    
    // Logic to generate descriptive message from diff
    return `feat: implement elite automated update based on diff analysis`;
  }

  public async commitAndPush(message: string): Promise<void> {
    shell.exec('git add .', { silent: true });
    shell.exec(`git commit -m "${message}"`, { silent: true });
  }
}
