import { AuditIssue } from '../scoring/types';
import shell from 'shelljs';
import fs from 'fs';

export class AccessibilityScanner {
  public scan(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
    
    const files = searchPaths.length > 0
      ? Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(tsx|jsx)$/))
      : Array.from(shell.ls('-R', '.')).filter(f => 
          f.match(/\.(tsx|jsx)$/) && 
          !f.startsWith('.') &&
          !f.includes('node_modules') && 
          !f.includes('dist')
        );

    files.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');

      // 1. Missing Alt Text
      const imgWithoutAlt = (content.match(/<img(?![^>]*\balt=)[^>]*>/g) || []);
      if (imgWithoutAlt.length > 0) {
        issues.push({
          category: 'accessibility',
          level: 'major',
          name: 'Missing Alt Text',
          message: `Found ${imgWithoutAlt.length} images without alt attributes.`,
          file,
          risk: 'Screen readers cannot describe images to visually impaired users.',
          fix: 'Add descriptive alt="description" to all <img> tags.',
          autoFixable: true
        });
      }

      // 2. Missing Button Labels
      const emptyButtons = (content.match(/<button\b[^>]*>\s*<\/button>/g) || []);
      if (emptyButtons.length > 0) {
        issues.push({
          category: 'accessibility',
          level: 'critical',
          name: 'Unlabeled Interactive Element',
          message: `Found ${emptyButtons.length} empty buttons.`,
          file,
          risk: 'Interactive elements without text or aria-labels are inaccessible.',
          fix: 'Add button text or aria-label="action name".',
          autoFixable: false
        });
      }
    });

    return issues;
  }
}
