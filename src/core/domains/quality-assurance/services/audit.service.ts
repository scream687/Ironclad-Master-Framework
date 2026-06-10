import { injectable } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import { AuditResult } from '../entities/audit-result.entity';
import { AuditIssue } from '../entities/audit-issue.entity';
import { AuditLevel } from '../value-objects/audit-level.vo';

@injectable()
export class AuditService {
  public async runFullAudit(): Promise<AuditResult> {
    const startedAt = new Date();
    const issues: AuditIssue[] = [];

    // 1. Language-Agnostic Logs Check
    issues.push(...this.checkUnauthorizedLogs());

    // 2. Cross-Language TODO Check
    issues.push(...this.checkIncompleteSparcCycles());

    // 3. Directory Integrity
    issues.push(...this.checkDirectoryIntegrity());

    // 4. Rule Synchronization
    issues.push(...this.checkRuleSynchronization());

    // 5. Governance Rule 5: Design Intelligence
    issues.push(...this.checkGovernanceRule5());

    return new AuditResult(issues, startedAt, new Date());
  }

  private checkGovernanceRule5(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    
    // We search for files that are likely UI whitelisted (pages, components)
    const uiPatterns = [
      'src/app/',
      'src/components/',
      'src/pages/',
      'src/ui/'
    ];

    const allFiles = Array.from(shell.find('.')).filter(file => {
      return (file.endsWith('.tsx') || file.includes('page.ts') || file.includes('component.ts')) &&
             !file.includes('node_modules') && 
             !file.includes('.ai-core') && 
             !file.includes('dist');
    });

    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.includes('@ironclad-design-signature')) {
        issues.push(new AuditIssue(
          'GOVERNANCE_BREACH_RULE_5',
          `UI file ${file} is missing a mandatory @ironclad-design-signature header.`,
          AuditLevel.error(),
          file
        ));
      }
    });

    return issues;
  }

  private checkUnauthorizedLogs(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const patterns = [
      { ext: /\.(js|ts)$/, pattern: 'console.log', lang: 'JS/TS' },
      { ext: /\.py$/, pattern: 'print(', lang: 'Python' },
      { ext: /\.go$/, pattern: 'fmt.Print', lang: 'Go' },
      { ext: /\.rs$/, pattern: 'println!', lang: 'Rust' }
    ];

    const searchPaths = ['src', 'docs', 'scripts', '.'].filter(p => fs.existsSync(p));
    const allFiles = Array.from(shell.find(searchPaths)).filter(file => {
      return !file.includes('node_modules') && 
             !file.split(path.sep).some(part => part.startsWith('.') && part !== '.') &&
             !file.includes('dist');
    });

    allFiles.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      
      patterns.forEach(({ ext, pattern, lang }) => {
        if (file.match(ext) && content.includes(pattern) && 
            !file.includes('audit.service.ts') && 
            !file.includes('harness.service.ts') && 
            !file.includes('terminal-ui.ts') &&
            !file.startsWith('scripts/') &&
            !file.includes('src/cli/index.ts')) {
          issues.push(new AuditIssue(
            'UNAUTHORIZED_LOGS',
            `Found unauthorized ${lang} log (${pattern}) in: ${file}`,
            AuditLevel.error(),
            file
          ));
        }
      });
    });

    return issues;
  }

  private checkIncompleteSparcCycles(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const todoPatterns = ['// TODO', '# TODO', '-- TODO', '/* TODO */'];
    
    const searchPaths = ['src', 'lib', 'app', 'pages', 'components', 'plans', 'docs'].filter(p => fs.existsSync(p));
    const allFiles = searchPaths.length > 0
      ? Array.from(shell.find(searchPaths)).filter(file => !file.includes('node_modules'))
      : Array.from(shell.ls('-R', '.')).filter(file => 
          !file.startsWith('.') && 
          !file.includes('node_modules') && 
          !file.includes('dist')
        );

    allFiles.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      
      todoPatterns.forEach(pattern => {
        if (content.includes(pattern) && !file.includes('audit.service.ts') && !file.includes('distillation.service.ts')) {
          issues.push(new AuditIssue(
            'INCOMPLETE_SPARC',
            `Found incomplete SPARC cycle (${pattern}) in: ${file}`,
            AuditLevel.error(),
            file
          ));
        }
      });
    });

    return issues;
  }

  private checkDirectoryIntegrity(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const requiredDirs = ['.ai-core/rules', '.ai-core/skills', 'plans', 'docs', 'scripts', 'bin', 'src/core'];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        issues.push(new AuditIssue(
          'DIRECTORY_INTEGRITY',
          `Missing mandatory directory: ${dir}`,
          AuditLevel.error()
        ));
      }
    }

    return issues;
  }

  private checkRuleSynchronization(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const requiredRules = [
      '.clinerules', 
      '.cursorrules', 
      '.windsurfrules', 
      '.aiderules', 
      '.github/copilot-instructions.md',
      'CLAUDE.md', 
      'GEMINI.md', 
      'SKILL_ROUTER.md'
    ];
    
    for (const file of requiredRules) {
      if (!fs.existsSync(file)) {
        issues.push(new AuditIssue(
          'RULE_SYNCHRONIZATION',
          `Missing mandatory rule file: ${file}`,
          AuditLevel.error()
        ));
      }
    }

    return issues;
  }
}
