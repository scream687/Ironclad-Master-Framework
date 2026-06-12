import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ArchitectureScanner } from './architecture';

describe('ArchitectureScanner', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-arch-'));
    fs.mkdirSync(path.join(tmpDir, 'src'), { recursive: true });
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('does not count whitespace inside string literals as nesting', () => {
    // A flat file containing a string with lots of internal double-spaces
    const content = `const banner = "a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r";\n`;
    fs.writeFileSync(path.join(tmpDir, 'src', 'flat.ts'), content);
    const issues = new ArchitectureScanner().scan();
    expect(issues.filter(i => i.name === 'Deep Nesting Detected')).toHaveLength(0);
  });

  it('flags genuinely deep leading indentation', () => {
    const deepLine = ' '.repeat(2 * 10) + 'doSomething();';
    fs.writeFileSync(path.join(tmpDir, 'src', 'deep.ts'), `function f() {\n${deepLine}\n}\n`);
    const issues = new ArchitectureScanner().scan();
    expect(issues.filter(i => i.name === 'Deep Nesting Detected')).toHaveLength(1);
  });

  it('does NOT enforce design signature by default', () => {
    fs.writeFileSync(path.join(tmpDir, 'src', 'Widget.tsx'), 'export const W = () => null;');
    const issues = new ArchitectureScanner().scan();
    expect(issues.filter(i => i.name.includes('GOVERNANCE'))).toHaveLength(0);
  });

  it('enforces design signature when enabled in .ironclad.json', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.ironclad.json'),
      JSON.stringify({ rules: { designSignature: true } })
    );
    fs.writeFileSync(path.join(tmpDir, 'src', 'Widget.tsx'), 'export const W = () => null;');
    const issues = new ArchitectureScanner().scan();
    expect(issues.filter(i => i.name.includes('GOVERNANCE'))).toHaveLength(1);
  });
});
