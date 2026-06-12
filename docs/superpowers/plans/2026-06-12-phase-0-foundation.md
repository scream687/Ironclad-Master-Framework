# Phase 0: Foundation & Bug Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every critical/high bug from the 2026-06-12 review, replace fake test scaffolds with a real vitest suite, and make the package actually installable — the foundation all later phases build on.

**Architecture:** Surgical fixes inside the existing DDD structure. New units: `ConfigService` (reads `.ironclad.json`), `SafeWriteService` (backup-before-write). Build switches from broken tsc-only output to tsup bundling so `bin` runs compiled JS instead of spawning dev-only `tsx`.

**Tech Stack:** TypeScript (strict, ESM), vitest, tsup, commander, better-sqlite3, inversify.

**Spec:** `docs/superpowers/specs/2026-06-12-ironclad-v2-production-design.md` (Section 1)

**Working directory:** `~/Developer/Ironclad-Master-Framework`, branch `feat/ironclad-v2-production`

---

### Task 1: Test infrastructure — vitest in, fake scaffolds out

The repo has ~40 auto-generated `*.spec.ts` files containing only `expect(true).toBe(true)` with broken imports (e.g. `import { Security } from './security'` — the file exports `SecurityScanner`). There is a `jest.config.js` but jest is not installed. These are slop: delete them, install vitest.

**Files:**
- Delete: all existing `src/**/*.spec.ts`, `__tests__/tdd-service.spec.ts`, `__tests__/watch-service.spec.ts`, `jest.config.js`
- Keep: `src/core/domains/task-management/__tests__/entities/task.entity.test.ts` (verify it compiles; delete if it is also a scaffold)
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)

- [ ] **Step 1: Delete the slop scaffolds**

```bash
cd ~/Developer/Ironclad-Master-Framework
grep -rl "SSS-Tier Automated Scaffold" src __tests__ | xargs rm
rm -f jest.config.js
# Check the one remaining test file compiles; if it's also `expect(true)` slop, remove it too:
cat src/core/domains/task-management/__tests__/entities/task.entity.test.ts
```

- [ ] **Step 2: Install vitest and tsup**

```bash
npm install -D vitest tsup
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@shared': path.resolve(__dirname, 'src/core/shared'),
      '@domains': path.resolve(__dirname, 'src/core/domains'),
    },
  },
});
```

- [ ] **Step 4: Update package.json test script**

In `package.json` replace `"test": "node tests/run-all.js"` with:

```json
"test": "vitest run",
"test:watch": "vitest"
```

(`tests/run-all.js` stays on disk; it still smoke-tests the hook scripts and will be folded into CI later.)

- [ ] **Step 5: Verify vitest runs (zero tests is OK at this point)**

Run: `npx vitest run --passWithNoTests`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: replace fake jest scaffolds with vitest infrastructure"
```

---

### Task 2: ConfigService — `.ironclad.json` loader

Later tasks (Rule 5 gating) need config. Build it first. TDD.

**Files:**
- Create: `src/core/config/config.service.ts`
- Test: `src/core/config/config.service.spec.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/core/config/config.service.spec.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/core/config`
Expected: FAIL — cannot resolve `./config.service`.

- [ ] **Step 3: Implement ConfigService**

```typescript
// src/core/config/config.service.ts
import fs from 'fs';
import path from 'path';

export interface IroncladConfig {
  rules: {
    /** Require @ironclad-design-signature headers in UI files (off by default). */
    designSignature: boolean;
  };
}

export const DEFAULT_CONFIG: IroncladConfig = {
  rules: {
    designSignature: false,
  },
};

export class ConfigService {
  public static load(cwd: string = process.cwd()): IroncladConfig {
    const configPath = path.join(cwd, '.ironclad.json');
    if (!fs.existsSync(configPath)) {
      return structuredClone(DEFAULT_CONFIG);
    }
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return {
        rules: {
          designSignature: raw?.rules?.designSignature === true,
        },
      };
    } catch {
      console.warn(`[Ironclad] Invalid .ironclad.json at ${configPath} — using defaults.`);
      return structuredClone(DEFAULT_CONFIG);
    }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/core/config`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/core/config
git commit -m "feat: ConfigService for .ironclad.json with safe defaults"
```

---

### Task 3: Fix ESM `require()` crash in CLI `init`

`src/cli/index.ts:106-108` uses CommonJS `require()` in a `"type":"module"` package — the `init` command crashes at runtime.

**Files:**
- Modify: `src/cli/index.ts:101-109`

- [ ] **Step 1: Replace the require block**

In `src/cli/index.ts`, add to the top-level imports:

```typescript
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
```

Replace the `init` action body:

```typescript
  program
    .command('init')
    .description('Initialize Ironclad Framework in the current repository')
    .action(() => {
      console.log(chalk.blue('🛡️ Initializing Ironclad Enterprise Ecosystem...'));
      const moduleDir = path.dirname(fileURLToPath(import.meta.url));
      execSync(`node ${path.resolve(moduleDir, '../../install.js')}`, { stdio: 'inherit' });
    });
```

- [ ] **Step 2: Verify the CLI loads and no require() remains**

Run: `npx tsx src/cli/index.ts --help && grep -n "require(" src/cli/index.ts`
Expected: help text prints; grep returns nothing (exit 1).

- [ ] **Step 3: Commit**

```bash
git add src/cli/index.ts
git commit -m "fix: replace CommonJS require with ESM imports in init command"
```

---

### Task 4: Fix PerformanceScanner binary-as-UTF-8 read

`src/scanners/performance.ts:21` reads `.png/.jpg/.jpeg/.webp` files as UTF-8 text. Images only need `statSync`.

**Files:**
- Modify: `src/scanners/performance.ts`
- Test: `src/scanners/performance.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/scanners/performance.spec.ts
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
```

Note: the `import { a${i} } from 'mod${i}'` pattern will not match the scanner's regex (it requires `{...}` braces — it does have them). Verify the regex `/import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g` matches; it does.

- [ ] **Step 2: Run tests to verify current behavior fails or is fragile**

Run: `npx vitest run src/scanners/performance.spec.ts`
Expected: the first test may pass-by-luck (Node replaces invalid UTF-8 instead of throwing) but the implementation is still wrong. Proceed regardless — the refactor makes behavior explicit.

- [ ] **Step 3: Rewrite the scan loop — separate image handling from text handling**

Replace the `files.forEach` block in `src/scanners/performance.ts` with:

```typescript
    const IMAGE_RE = /\.(png|jpg|jpeg|webp)$/;
    const MAX_IMAGE_BYTES = 1024 * 500; // 500KB
    const MAX_IMPORTS = 20;

    files.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;

      if (file.match(IMAGE_RE)) {
        const stats = fs.statSync(file);
        if (stats.size > MAX_IMAGE_BYTES) {
          issues.push({
            category: 'performance',
            level: 'major',
            name: 'Unoptimized Image',
            message: `Image size is ${(stats.size / 1024).toFixed(2)}KB.`,
            file,
            risk: 'Increased LCP (Largest Contentful Paint) and high bandwidth usage.',
            fix: 'Compress image or use Next/Image components.',
            autoFixable: false
          });
        }
        return; // never read image bytes as text
      }

      const content = fs.readFileSync(file, 'utf-8');
      const importMatches = content.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g) || [];
      if (importMatches.length > MAX_IMPORTS) {
        issues.push({
          category: 'performance',
          level: 'minor',
          name: 'Import Bloat',
          message: `File has ${importMatches.length} imports.`,
          file,
          risk: 'Increased bundle size and slower analysis time.',
          fix: 'Use tree-shaking or split the component.',
          autoFixable: false
        });
      }
    });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/scanners/performance.spec.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/scanners/performance.ts src/scanners/performance.spec.ts
git commit -m "fix: stop reading binary images as UTF-8 in PerformanceScanner"
```

---

### Task 5: Fix TestingScanner broken nested-test detection

`src/scanners/testing.ts:26-29` builds `src/__tests__/foo.ts.test.ts`-style paths that can never exist.

**Files:**
- Modify: `src/scanners/testing.ts`
- Test: `src/scanners/testing.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/scanners/testing.spec.ts
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
```

- [ ] **Step 2: Run tests to verify the nested case fails**

Run: `npx vitest run src/scanners/testing.spec.ts`
Expected: third test FAILS (nested `__tests__` detection is broken).

- [ ] **Step 3: Fix the detection logic**

In `src/scanners/testing.ts`, add `import path from 'path';` to the imports, then replace the `hasTest` block:

```typescript
    sourceFiles.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const ext = path.extname(file);                       // ".ts"
      const stem = path.basename(file, ext);                // "nested"
      const dir = path.dirname(file);
      const suffixes = ['test', 'spec'];
      const exts = ['.ts', '.js', '.tsx'];

      const hasTest = suffixes.some(suffix =>
        exts.some(testExt => {
          const sibling = path.join(dir, `${stem}.${suffix}${testExt}`);
          const nested = path.join(dir, '__tests__', `${stem}.${suffix}${testExt}`);
          return fs.existsSync(sibling) || fs.existsSync(nested);
        })
      );

      if (!hasTest) {
        issues.push({
          category: 'testing',
          level: 'major',
          name: 'Missing Test Suite',
          message: `No unit tests found for: ${file}`,
          file,
          risk: 'Regressions go undetected. Logic remains unverified.',
          fix: `Create a test file at ${path.join(dir, `${stem}.test${ext}`)}`,
          autoFixable: true
        });
      }
    });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/scanners/testing.spec.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/scanners/testing.ts src/scanners/testing.spec.ts
git commit -m "fix: correct nested __tests__ detection in TestingScanner"
```

---

### Task 6: Fix ArchitectureScanner — nesting detection + Rule 5 opt-in

Two bugs: (a) nesting counts mid-line whitespace (strings/comments inflate it), (b) the `@ironclad-design-signature` check fires a critical on every UI file of every project. Fix (a) with leading-whitespace measurement; gate (b) behind `ConfigService` (default off).

**Files:**
- Modify: `src/scanners/architecture.ts`
- Test: `src/scanners/architecture.spec.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/scanners/architecture.spec.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/scanners/architecture.spec.ts`
Expected: tests 1 and 3 FAIL with current implementation.

- [ ] **Step 3: Fix the scanner**

In `src/scanners/architecture.ts`, add `import { ConfigService } from '../core/config/config.service';` to the imports. Replace the nesting block and the Rule 5 block inside `files.forEach`:

```typescript
  public scan(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const config = ConfigService.load();
    // ... existing searchPaths / files logic unchanged ...

    files.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      // 1. Files > 500 lines (God Components) — unchanged

      // 2. Deep Nesting — leading whitespace only
      const indentLevels = lines.map(line => {
        const leading = line.match(/^[ \t]*/)?.[0] ?? '';
        const tabs = (leading.match(/\t/g) || []).length;
        const spaces = leading.length - tabs;
        return tabs + Math.floor(spaces / 2);
      });
      const maxNesting = Math.max(0, ...indentLevels);
      if (maxNesting > 8) {
        issues.push({
          category: 'architecture',
          level: 'minor',
          name: 'Deep Nesting Detected',
          message: `Indentation level reached ${maxNesting}.`,
          file,
          risk: 'High cyclomatic complexity. Reduced readability.',
          fix: 'Extract nested logic into helper functions.',
          autoFixable: false
        });
      }

      // 3. Governance Rule 5 — opt-in via .ironclad.json
      if (config.rules.designSignature) {
        const isUiFile = file.match(/\.(tsx|jsx)$/) || file.includes('page.ts') || file.includes('component.ts');
        if (isUiFile && !content.includes('@ironclad-design-signature')) {
          issues.push({
            category: 'architecture',
            level: 'critical',
            name: 'GOVERNANCE BREACH: Rule 5',
            message: `UI file is missing a mandatory @ironclad-design-signature.`,
            file,
            risk: 'Violates mandatory design intelligence protocol. Potential for "slop" UI.',
            fix: 'Run the design intelligence chain (ui-ux-pro-max) and add the signature header.',
            autoFixable: false
          });
        }
      }
    });

    return issues;
  }
```

Keep the God Component check exactly as it is today.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/scanners/architecture.spec.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/scanners/architecture.ts src/scanners/architecture.spec.ts
git commit -m "fix: leading-whitespace nesting detection; gate Rule 5 behind config"
```

---

### Task 7: SafeWriteService — backup before any framework write

`InfinityHarnessService.healTask()` overwrites user source files with no backup. Build `SafeWriteService` (TDD), then route `healTask` through it.

**Files:**
- Create: `src/core/shared/services/safe-write.service.ts`
- Test: `src/core/shared/services/safe-write.service.spec.ts`
- Modify: `src/core/domains/automation/services/infinity-harness.service.ts` (healTask)

- [ ] **Step 1: Write the failing tests**

```typescript
// src/core/shared/services/safe-write.service.spec.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/core/shared/services`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement SafeWriteService**

```typescript
// src/core/shared/services/safe-write.service.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/core/shared/services`
Expected: 3 passed.

- [ ] **Step 5: Route healTask through SafeWriteService**

In `src/core/domains/automation/services/infinity-harness.service.ts`:

Add import: `import { SafeWriteService } from '../../../shared/services/safe-write.service';`

Add to the constructor parameters:

```typescript
    @inject(SafeWriteService) private safeWrite: SafeWriteService
```

Replace the final line of `healTask` (`fs.writeFileSync(breach.file, content);`) with:

```typescript
    const result = this.safeWrite.write(breach.file, content);
    if (result.backupPath) {
      console.log(`   💾  Backup saved: ${result.backupPath}`);
    }
```

Then bind it in the automation domain. In `src/core/domains/automation/automation.domain.ts`, locate the container bindings (where `InfinityHarnessService` is bound) and add alongside them:

```typescript
container.bind(SafeWriteService).toSelf().inSingletonScope();
```

(with the matching import at the top of that file).

- [ ] **Step 6: Verify everything still compiles and tests pass**

Run: `npx tsc --noEmit && npx vitest run`
Expected: both exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/core/shared/services src/core/domains/automation
git commit -m "feat: SafeWriteService with backups; healTask no longer overwrites blindly"
```

---

### Task 8: Task entity typed metadata + remove `(as any)` and DB backdoors

Five `(task as any).props.metadata` casts in `infinity-harness.service.ts`, a raw `dbInstance` getter used to run ad-hoc SQL, and collision-prone `Math.random()` thought IDs.

**Files:**
- Modify: `src/core/domains/task-management/entities/task.entity.ts`
- Modify: `src/core/domains/memory/services/agent-db.service.ts`
- Modify: `src/core/domains/automation/services/infinity-harness.service.ts`
- Test: `src/core/domains/task-management/entities/task.entity.spec.ts`

- [ ] **Step 1: Write the failing test for metadata accessors**

```typescript
// src/core/domains/task-management/entities/task.entity.spec.ts
import { describe, it, expect } from 'vitest';
import { Task } from './task.entity';
import { Priority } from '../value-objects/priority.vo';

describe('Task metadata', () => {
  it('sets and gets metadata values', () => {
    const task = Task.create('demo', Priority.high());
    task.setMetadata('stagnationCount', 3);
    expect(task.getMetadata<number>('stagnationCount')).toBe(3);
  });

  it('returns undefined for unset keys', () => {
    const task = Task.create('demo', Priority.high());
    expect(task.getMetadata('missing')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/domains/task-management`
Expected: FAIL — `setMetadata is not a function`.

- [ ] **Step 3: Add accessors to Task entity**

In `src/core/domains/task-management/entities/task.entity.ts`, add below the existing getters:

```typescript
  public getMetadata<T = unknown>(key: string): T | undefined {
    return this.props.metadata[key] as T | undefined;
  }

  public setMetadata(key: string, value: unknown): void {
    this.props.metadata[key] = value;
    this.props.updatedAt = new Date();
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/domains/task-management`
Expected: PASS.

- [ ] **Step 5: Add `recordThought` to AgentDBService, remove `dbInstance` getter**

In `src/core/domains/memory/services/agent-db.service.ts`, add `import { randomUUID } from 'crypto';` to the imports. Delete the `public get dbInstance()` getter entirely and add:

```typescript
  public recordThought(taskId: string, thought: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO thoughts (id, task_id, thought, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(`thought-${randomUUID()}`, taskId, thought, Date.now());
  }
```

- [ ] **Step 6: Replace all `(as any)` casts and the raw SQL in InfinityHarnessService**

In `src/core/domains/automation/services/infinity-harness.service.ts`:

`ensureDecomposition` becomes:

```typescript
  private async ensureDecomposition(rootTask: Task): Promise<boolean> {
    if (rootTask.getMetadata<boolean>('readyForVerification')) return false;

    await this.decomposeObjective(rootTask);
    const newSubTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);

    if (newSubTasks.length === 0) {
      rootTask.setMetadata('readyForVerification', true);
      await this.taskRepo.save(rootTask);
      return false;
    }
    return true;
  }
```

In `runGlobalVerification`, replace `(rootTask as any).props.metadata.readyForVerification = false;` with:

```typescript
      rootTask.setMetadata('readyForVerification', false);
```

`checkpointThought` becomes:

```typescript
  private async checkpointThought(taskId: string, thought: string): Promise<void> {
    this.agentDB.recordThought(taskId, thought);
  }
```

In `verifyTaskSuccess` and `healTask`, replace `(task as any).props.metadata.breach` with:

```typescript
    const breach = task.getMetadata<any>('breach');
```

In `backtrackStrategy`, replace the metadata access with:

```typescript
    const count = (rootTask.getMetadata<number>('stagnationCount') ?? 0) + 1;
    rootTask.setMetadata('stagnationCount', count);

    if (count > 5) {
      throw new Error(`CRITICAL_STAGNATION: Objective ${rootTask.description} cannot be completed autonomously.`);
    }
```

In `decomposeObjective`, the sub-task is created with `metadata: { breach }` — that stays, since `getMetadata('breach')` reads the same shape.

- [ ] **Step 7: Verify no `as any` props access remains and everything compiles**

Run: `grep -rn "as any).props" src/ ; npx tsc --noEmit && npx vitest run`
Expected: grep finds nothing; build and tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/core
git commit -m "refactor: typed Task metadata accessors, recordThought API, UUID thought IDs"
```

---

### Task 9: TerminalUI cleanup — remove fake share URL

`renderCertification` prints `ironclad.dev/share/<random>` — a non-functional URL fabricated with `Math.random()`. Remove it.

**Files:**
- Modify: `src/formatter/terminal-ui.ts:99-100`

- [ ] **Step 1: Delete the share block**

Remove these two lines from `renderCertification`:

```typescript
    console.log(chalk.dim('  Share:'));
    console.log(chalk.blue.underline(`  ironclad.dev/share/${Math.random().toString(36).substring(7)}\n`));
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/formatter/terminal-ui.ts
git commit -m "fix: remove fabricated share URL from certification output"
```

---

### Task 10: Build pipeline — tsup bundle, working bin, no invasive postinstall

Today: `bin/ironclad.js` spawns dev-only `tsx`; `start` points at a nonexistent path; `postinstall` runs setup on every install; compiled tsc output can't run under Node (extensionless ESM imports). Fix: bundle with tsup, convert the CLI's dynamic imports to static, point bin at the bundle.

**Files:**
- Create: `tsup.config.ts`
- Modify: `src/cli/index.ts` (dynamic → static imports), `bin/ironclad.js`, `package.json`

- [ ] **Step 1: Convert dynamic imports to static in the CLI**

In `src/cli/index.ts`, add to the top-level imports:

```typescript
import { startDashboardServer } from '../pro/dashboard-server';
import { runMcpServer } from '../mcp/index';
```

Replace the `dashboard` action body:

```typescript
    .action(async () => {
      console.log(chalk.magenta('🚀 Launching Ironclad Pro Dashboard Server...'));
      await startDashboardServer();
    });
```

Replace the `mcp` action body:

```typescript
    .action(async () => {
      console.log(chalk.cyan('Starting Ironclad MCP Server...'));
      await runMcpServer();
    });
```

Delete both `// @ts-ignore` lines. If `startDashboardServer` is not actually exported from `src/pro/dashboard-server.ts`, check that file and use its real export name — do not add a new export without checking.

Also, in `src/mcp/index.ts`, the self-execution guard at the bottom (`if (import.meta.url === ...)`) must NOT run when bundled into the CLI. Replace it with a dedicated entry: delete the guard block from `src/mcp/index.ts` and create `src/mcp/server.ts`:

```typescript
// src/mcp/server.ts — standalone MCP server entrypoint
import { runMcpServer } from './index';

runMcpServer().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});
```

- [ ] **Step 2: Create tsup.config.ts**

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'cli/index': 'src/cli/index.ts',
    'mcp/server': 'src/mcp/server.ts',
  },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  sourcemap: true,
  // better-sqlite3 is a native module — never bundle it
  external: ['better-sqlite3'],
});
```

- [ ] **Step 3: Fix bin/ironclad.js**

Replace the entire file:

```javascript
#!/usr/bin/env node
import '../dist/cli/index.js';
```

- [ ] **Step 4: Update package.json scripts**

```json
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "start": "node dist/cli/index.js",
    "mcp": "node dist/mcp/server.js"
  }
```

This **removes** the `postinstall` line entirely (setup now happens only via explicit `ironclad init`).

- [ ] **Step 5: Build and smoke-test the compiled CLI**

Run: `npm run build && node dist/cli/index.js --help`
Expected: build succeeds; help text prints from the compiled bundle (no tsx involved).

- [ ] **Step 6: npm pack smoke install**

```bash
npm pack --silent
mkdir -p /tmp/ironclad-pack-test && cd /tmp/ironclad-pack-test
npm init -y >/dev/null
npm install ~/Developer/Ironclad-Master-Framework/ironclad-master-framework-1.3.0.tgz
npx ironclad --help
cd ~/Developer/Ironclad-Master-Framework && rm -f ironclad-master-framework-1.3.0.tgz
```

Expected: `npx ironclad --help` prints help from the installed package. If it fails, the error will name the unresolved module — fix the tsup `external` list accordingly and rebuild.

- [ ] **Step 7: Verify full suite still green**

Run: `npm run typecheck && npm test`
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: tsup bundling, working bin against dist, remove invasive postinstall"
```

---

### Task 11: Phase 0 exit audit

Mandatory re-audit after code (spec §4): run the framework's own audit on itself, plus build and tests, before the phase closes.

- [ ] **Step 1: Full verification**

```bash
cd ~/Developer/Ironclad-Master-Framework
npm run typecheck && npm test && npm run build
```

Expected: all exit 0.

- [ ] **Step 2: Self-audit**

Run: `node dist/cli/index.js audit`
Expected: completes without crashing. Record the Truth Score in the commit message. Critical issues from Phase 0's own scope must be zero; pre-existing issues outside scope get logged for later phases.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin feat/ironclad-v2-production
```

---

## Self-Review Notes

- **Spec coverage (Section 1):** items 1→Task 3, 2→Task 4, 3→Task 7, 4→Task 5, 5→Task 6, 6/7→Task 10, 8→Task 6, 9→Task 9, 10→Task 10, 11→Task 8, 12→Task 8, `.ironclad.json`→Task 2. Full coverage.
- **Order matters:** Task 2 (ConfigService) must precede Task 6 (uses it). Task 1 must be first (test runner). Task 10 before 11.
- **Known risk:** Task 10 Step 1 references `startDashboardServer` — the step explicitly instructs verifying the real export name before wiring.
