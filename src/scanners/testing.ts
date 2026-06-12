import { AuditIssue } from '../scoring/types';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

const TEST_FILE_RE = /\.(test|spec)\.(ts|js|tsx|jsx)$/;

export class TestingScanner {
  public scan(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));

    const isSourceFile = (f: string) =>
      Boolean(f.match(/\.(ts|js|tsx|jsx)$/)) &&
      !TEST_FILE_RE.test(f) &&
      !f.includes('__tests__');

    const sourceFiles = searchPaths.length > 0
      ? Array.from(shell.find(searchPaths)).filter(isSourceFile)
      : Array.from(shell.ls('-R', '.')).filter(f =>
          isSourceFile(f) &&
          !f.startsWith('.') &&
          !f.includes('node_modules')
        );

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

    return issues;
  }
}
