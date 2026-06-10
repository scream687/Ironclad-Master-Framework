import { AuditIssue } from '../scoring/types';
import shell from 'shelljs';
import fs from 'fs';

export class PerformanceScanner {
  public scan(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
    
    const files = searchPaths.length > 0
      ? Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(ts|js|tsx|jsx|png|jpg|jpeg|webp)$/))
      : Array.from(shell.ls('-R', '.')).filter(f => 
          f.match(/\.(ts|js|tsx|jsx|png|jpg|jpeg|webp)$/) && 
          !f.startsWith('.') &&
          !f.includes('node_modules') && 
          !f.includes('dist')
        );

    files.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');

      // 1. Unused Imports heuristic
      const importMatches = content.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g) || [];
      if (importMatches.length > 20) {
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

      // 2. Large Image check
      if (file.match(/\.(png|jpg|jpeg|webp)$/)) {
          const stats = fs.statSync(file);
          if (stats.size > 1024 * 500) { // > 500KB
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
      }
    });

    return issues;
  }
}
