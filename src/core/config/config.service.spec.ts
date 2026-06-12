import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ConfigService, DEFAULT_CONFIG } from './config.service';

describe('ConfigService', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironclad-config-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns defaults when no .ironclad.json exists', () => {
    const config = ConfigService.load(tmpDir);
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('reads rules.designSignature from .ironclad.json', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.ironclad.json'),
      JSON.stringify({ rules: { designSignature: true } })
    );
    const config = ConfigService.load(tmpDir);
    expect(config.rules.designSignature).toBe(true);
  });

  it('falls back to defaults on invalid JSON', () => {
    fs.writeFileSync(path.join(tmpDir, '.ironclad.json'), '{not json');
    const config = ConfigService.load(tmpDir);
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('does not mutate DEFAULT_CONFIG between loads', () => {
    const a = ConfigService.load(tmpDir);
    a.rules.designSignature = true;
    const b = ConfigService.load(tmpDir);
    expect(b.rules.designSignature).toBe(false);
  });
});
