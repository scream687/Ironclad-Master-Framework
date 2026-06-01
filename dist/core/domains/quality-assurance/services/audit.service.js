var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import { AuditResult } from '../entities/audit-result.entity';
import { AuditIssue } from '../entities/audit-issue.entity';
import { AuditLevel } from '../value-objects/audit-level.vo';
let AuditService = class AuditService {
    async runFullAudit() {
        const startedAt = new Date();
        const issues = [];
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
    checkUnauthorizedLogs() {
        const issues = [];
        const logFiles = shell.find(['src', 'docs', 'scripts']).filter(file => {
            return file.match(/\.(js|ts|sh|md)$/) &&
                !file.includes('node_modules') &&
                !file.includes('.ai-core') &&
                !file.includes('dist');
        });
        logFiles.forEach(file => {
            if (fs.lstatSync(file).isDirectory())
                return;
            const content = fs.readFileSync(file, 'utf-8');
            if (content.includes('console.log') &&
                !file.includes('audit.service.ts') &&
                !file.includes('distillation.service.ts') &&
                !file.includes('src/cli/index.ts')) {
                issues.push(new AuditIssue('UNAUTHORIZED_LOGS', `Found console.log in unauthorized file: ${file}`, AuditLevel.error(), file));
            }
        });
        return issues;
    }
    checkIncompleteSparcCycles() {
        const issues = [];
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
            if (fs.lstatSync(file).isDirectory())
                return;
            const content = fs.readFileSync(file, 'utf-8');
            // Ignore // TODO if it's in the audit or distillation services themselves (where we define the rules)
            if (content.includes('// TODO') &&
                !file.includes('audit.service.ts') &&
                !file.includes('distillation.service.ts')) {
                issues.push(new AuditIssue('INCOMPLETE_SPARC', `Found incomplete SPARC cycle (TODO) in file: ${file}`, AuditLevel.error(), file));
            }
        });
        return issues;
    }
    checkDirectoryIntegrity() {
        const issues = [];
        const requiredDirs = ['.ai-core/rules', '.ai-core/skills', 'plans', 'docs', 'scripts', 'bin', 'src/core'];
        for (const dir of requiredDirs) {
            if (!fs.existsSync(dir)) {
                issues.push(new AuditIssue('DIRECTORY_INTEGRITY', `Missing mandatory directory: ${dir}`, AuditLevel.error()));
            }
        }
        return issues;
    }
    checkRuleSynchronization() {
        const issues = [];
        const requiredRules = ['.clinerules', '.cursorrules', '.windsurfrules', 'CLAUDE.md', 'GEMINI.md', 'SKILL_ROUTER.md'];
        for (const file of requiredRules) {
            if (!fs.existsSync(file)) {
                issues.push(new AuditIssue('RULE_SYNCHRONIZATION', `Missing mandatory rule file: ${file}`, AuditLevel.error()));
            }
        }
        return issues;
    }
};
AuditService = __decorate([
    injectable()
], AuditService);
export { AuditService };
