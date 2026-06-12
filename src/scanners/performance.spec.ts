import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PerformanceScanner } from './performance';

describe('PerformanceScanner', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-perf-'));
    fs.mkdirSync(path.join(tmpDir, 'src'));
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('flags images over 500KB without reading them as text', () => {
    // 600KB of raw binary bytes — invalid UTF-8 on purpose
    const binary = Buffer.alloc(600 * 1024, 0xff);
    fs.writeFileSync(path.join(tmpDir, 'src', 'hero.png'), binary);

    const issues = new PerformanceScanner().scan();

    const imageIssues = issues.filter(i => i.name === 'Unoptimized Image');
    expect(imageIssues).toHaveLength(1);
    expect(imageIssues[0]!.file).toContain('hero.png');
  });

  it('does not flag small images', () => {
    fs.writeFileSync(path.join(tmpDir, 'src', 'icon.png'), Buffer.alloc(10 * 1024, 0xff));
    const issues = new PerformanceScanner().scan();
    expect(issues.filter(i => i.name === 'Unoptimized Image')).toHaveLength(0);
  });

  it('flags import bloat in code files', () => {
    const imports = Array.from({ length: 25 }, (_, i) => `import { a${i} } from 'mod${i}';`).join('\n');
    fs.writeFileSync(path.join(tmpDir, 'src', 'bloated.ts'), imports);
    const issues = new PerformanceScanner().scan();
    expect(issues.filter(i => i.name === 'Import Bloat')).toHaveLength(1);
  });
});
