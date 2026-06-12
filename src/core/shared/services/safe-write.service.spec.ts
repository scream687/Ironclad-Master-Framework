import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { SafeWriteService } from './safe-write.service';

describe('SafeWriteService', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-safewrite-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('backs up an existing file before overwriting it', () => {
    const target = path.join(tmpDir, 'app.ts');
    fs.writeFileSync(target, 'original');
    const service = new SafeWriteService(path.join(tmpDir, 'backups'));

    const result = service.write(target, 'modified');

    expect(fs.readFileSync(target, 'utf-8')).toBe('modified');
    expect(result.backupPath).toBeDefined();
    expect(fs.readFileSync(result.backupPath!, 'utf-8')).toBe('original');
  });

  it('writes a new file without creating a backup', () => {
    const target = path.join(tmpDir, 'new.ts');
    const service = new SafeWriteService(path.join(tmpDir, 'backups'));

    const result = service.write(target, 'fresh');

    expect(fs.readFileSync(target, 'utf-8')).toBe('fresh');
    expect(result.backupPath).toBeUndefined();
  });

  it('dry-run writes nothing and reports written:false', () => {
    const target = path.join(tmpDir, 'app.ts');
    fs.writeFileSync(target, 'original');
    const service = new SafeWriteService(path.join(tmpDir, 'backups'));

    const result = service.write(target, 'modified', { dryRun: true });

    expect(result.written).toBe(false);
    expect(fs.readFileSync(target, 'utf-8')).toBe('original');
  });
});
