import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

export interface SafeWriteResult {
  written: boolean;
  backupPath?: string | undefined;
}

export interface SafeWriteOptions {
  dryRun?: boolean;
}

@injectable()
export class SafeWriteService {
  constructor(
    private readonly backupRoot: string = path.resolve('.ai-core', 'backups')
  ) {}

  public write(filePath: string, content: string, options: SafeWriteOptions = {}): SafeWriteResult {
    if (options.dryRun) {
      return { written: false };
    }

    let backupPath: string | undefined;
    if (fs.existsSync(filePath)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const relative = path.isAbsolute(filePath)
        ? path.relative('/', filePath)
        : filePath;
      backupPath = path.join(this.backupRoot, stamp, relative);
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(filePath, backupPath);
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    return { written: true, backupPath };
  }
}
