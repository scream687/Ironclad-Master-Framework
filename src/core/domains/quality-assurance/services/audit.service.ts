import { injectable } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import { AuditResult } from '../entities/audit-result.entity';
import { AuditIssue } from '../entities/audit-issue.entity';
import { AuditLevel } from '../value-objects/audit-level.vo';

@injectable()
export class AuditService {
  public async runFullAudit(): Promise<AuditResult> {
    const startedAt = new Date();
    const issues: AuditIssue[] = [];

    // 1. Logs Check
    const logsIssues = this.checkUnauthorizedLogs();
    issues.push(...logsIssues);

    // 2. TODO Check
    const todoIssues = this.checkIncompleteSparcCycles();
    issues.push(...todoIssues);

    // 3. Directory Integrity
    const dirIssues = this.checkDirectoryIntegrity();
    issues.push(...dirIssues);

    // 4. Rule Synchronization
    const ruleIssues = this.checkRuleSynchronization();
    issues.push(...ruleIssues);

    return new AuditResult(issues, startedAt, new Date());
  }

  private checkUnauthorizedLogs(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const logFiles = shell.find(['src', 'docs', 'scripts']).filter(file => {
      return file.match(/\.(js|ts|sh|md)$/) && 
             !file.includes('node_modules') && 
             !file.includes('.ai-core') &&
             !file.includes('dist');
    });

    logFiles.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('console.log') && 
          !file.includes('audit.service.ts') && 
          !file.includes('distillation.service.ts') && 
          !file.includes('src/cli/index.ts')) {
        issues.push(new AuditIssue(
          'UNAUTHORIZED_LOGS',
          `Found console.log in unauthorized file: ${file}`,
          AuditLevel.error(),
          file
        ));
      }
    });

    return issues;
  }

  private checkIncompleteSparcCycles(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const allFiles = shell.find('.').filter(file => {
      return file.match(/\.(js|ts|sh|md|sql)$/) && 
             !file.includes('node_modules') && 
             !file.includes('.ai-core') && 
             !file.includes('.husky') && 
             !file.includes('README.md') &&
             !file.includes('.next') &&
             !file.includes('dist');
    });

    allFiles.forEach(file => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, 'utf-8');
      // Ignore // TODO if it's in the audit or distillation services themselves (where we define the rules)
      if (content.includes('// TODO') && 
          !file.includes('audit.service.ts') && 
          !file.includes('distillation.service.ts')) {
        issues.push(new AuditIssue(
          'INCOMPLETE_SPARC',
          `Found incomplete SPARC cycle (TODO) in file: ${file}`,
          AuditLevel.error(),
          file
        ));
      }
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
    const requiredRules = ['.clinerules', '.cursorrules', '.windsurfrules', 'CLAUDE.md', 'GEMINI.md', 'SKILL_ROUTER.md'];
    
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
