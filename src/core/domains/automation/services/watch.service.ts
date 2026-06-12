import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

@injectable()
export class WatchService {
  private watcher: fs.FSWatcher | null = null;
  private isWatching = false;

  public async startDaemon(): Promise<void> {
    if (this.isWatching) {
      console.log('[WatchDaemon] Already running.');
      return;
    }

    const watchDir = path.join(process.cwd(), 'src');
    
    if (!fs.existsSync(watchDir)) {
      console.warn('[WatchDaemon] src directory not found. Halting daemon.');
      return;
    }

    console.log(`[WatchDaemon] Starting background intelligence watcher on ${watchDir}...`);
    
    this.watcher = fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.ts')) {
        console.log(`[WatchDaemon] Detected ${eventType} on ${filename}. Triggering intelligence loop.`);
        this.handleFileChange(filename);
      }
    });

    this.isWatching = true;
    console.log('[WatchDaemon] Active and listening for codebase anomalies.');
  }

  public stopDaemon(): void {
    if (this.watcher) {
      this.watcher.close();
      this.isWatching = false;
      console.log('[WatchDaemon] Daemon terminated.');
    }
  }

  private handleFileChange(filename: string): void {
    // In a full implementation, this triggers the AgentDB memory sync
    // or initiates an autonomous background review via LLM.
    const fullPath = path.join(process.cwd(), 'src', filename);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      console.log(`[WatchDaemon] File size: ${stat.size} bytes. Analysis queued.`);
    }
  }

  public async compressContext(content: string): Promise<string> {
    // Aggressive AST-equivalent stripping logic for token savings:
    // 1. Strip block comments
    let compressed = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 2. Strip single-line comments (but carefully avoid URLs in strings)
    compressed = compressed.replace(/([^\\:]|^)\/\/.*$/gm, '$1');
    
    // 3. Strip console.logs (often unnecessary for AI context)
    compressed = compressed.replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, '');
    
    // 4. Remove multiple consecutive empty lines
    compressed = compressed.replace(/\n\s*\n/g, '\n');
    
    // 5. Trim leading/trailing whitespace on lines
    compressed = compressed.split('\n').map(line => line.trim()).join('\n');
    
    // 6. Remove excess spaces (e.g., let   x =   5; -> let x = 5;)
    compressed = compressed.replace(/([\w}\]])\s+([\w{\[])/g, '$1 $2');
    
    // 7. Strip imports to keep purely logic (Optional, depending on strictness)
    // compressed = compressed.replace(/^import\s+.*?\s+from\s+['"].*?['"];?$/gm, '');

    return compressed.trim();
  }
}
