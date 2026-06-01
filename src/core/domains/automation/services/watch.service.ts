import { injectable } from 'inversify';
import shell from 'shelljs';

@injectable()
export class WatchService {
  public async startDaemon(): Promise<void> {
    // Daemon logic...
  }

  public async compressContext(content: string): Promise<string> {
    // Caveman mode compression
    return content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '').trim();
  }
}
