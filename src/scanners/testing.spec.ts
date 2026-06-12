import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TestingScanner } from './testing';

describe('TestingScanner', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-testing-'));
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('flags a source file with no test', () => {
    fs.writeFileSync(path.join(tmpDir, 'src', 'untested.ts'), 'export const x = 1;');
    const issues = new TestingScanner().scan();
    expect(issues.some(i => i.file?.includes('untested.ts'))).toBe(true);
  });

  it('does not flag a file with a sibling .spec.ts', () => {
    fs.writeFileSync(path.join(tmpDir, 'src', 'covered.ts'), 'export const x = 1;');
    fs.writeFileSync(path.join(tmpDir, 'src', 'covered.spec.ts'), 'it("x", () => {});');
    const issues = new TestingScanner().scan();
    expect(issues.some(i => i.file?.includes('covered.ts'))).toBe(false);
  });

  it('does not flag a file with a test in a sibling __tests__ directory', () => {
    fs.mkdirSync(path.join(tmpDir, 'src', '__tests__'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'src', 'nested.ts'), 'export const x = 1;');
    fs.writeFileSync(path.join(tmpDir, 'src', '__tests__', 'nested.test.ts'), 'it("x", () => {});');
    const issues = new TestingScanner().scan();
    expect(issues.some(i => i.file?.includes('nested.ts') && !i.file?.includes('__tests__'))).toBe(false);
  });
});
