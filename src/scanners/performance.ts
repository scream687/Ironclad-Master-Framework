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

    return issues;
  }
}
