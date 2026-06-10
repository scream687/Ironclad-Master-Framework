import { AuditIssue } from '../scoring/types';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

export class ArchitectureScanner {
  public scan(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
    
    // If none of the standard paths exist, we might be in the root of a project that doesn't follow these.
    // In that case, we scan the current dir but exclude hidden folders and common bloat.
    const files = searchPaths.length > 0 
      ? Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(ts|js|tsx|jsx)$/))
      : Array.from(shell.ls('-R', '.')).filter(f => 
          f.match(/\.(ts|js|tsx|jsx)$/) && 
          !f.startsWith('.') &&
          !f.includes('node_modules') && 
          !f.includes('dist')
        );

    files.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      // 1. Files > 500 lines (God Components)
      if (lines.length > 500) {
        issues.push({
          category: 'architecture',
          level: 'major',
          name: 'God Component Detected',
          message: `File has ${lines.length} lines.`,
          file,
          risk: 'Violates Single Responsibility Principle. Hard to maintain and test.',
          fix: 'Split the file into smaller, focused modules or hooks.',
          autoFixable: false
        });
      }

      // 2. Deep Nesting
      const maxNesting = Math.max(...lines.map(line => (line.match(/  |\t/g) || []).length));
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

      // 3. Governance Rule 5: Design Intelligence Signature
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
    });

    return issues;
  }
}
