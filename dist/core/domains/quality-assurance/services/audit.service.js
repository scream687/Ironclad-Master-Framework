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
        // 1. Language-Agnostic Logs Check
        issues.push(...this.checkUnauthorizedLogs());
        // 2. Cross-Language TODO Check
        issues.push(...this.checkIncompleteSparcCycles());
        // 3. Directory Integrity
        issues.push(...this.checkDirectoryIntegrity());
        // 4. Rule Synchronization
        issues.push(...this.checkRuleSynchronization());
        return new AuditResult(issues, startedAt, new Date());
    }
    checkUnauthorizedLogs() {
        const issues = [];
        const patterns = [
            { ext: /\.(js|ts)$/, pattern: 'console.log', lang: 'JS/TS' },
            { ext: /\.py$/, pattern: 'print(', lang: 'Python' },
            { ext: /\.go$/, pattern: 'fmt.Print', lang: 'Go' },
            { ext: /\.rs$/, pattern: 'println!', lang: 'Rust' }
        ];
        const allFiles = shell.find(['src', 'docs', 'scripts', '.']).filter(file => {
            return !file.includes('node_modules') && !file.includes('.ai-core') && !file.includes('dist');
        });
        allFiles.forEach(file => {
            if (fs.lstatSync(file).isDirectory())
                return;
            const content = fs.readFileSync(file, 'utf-8');
            patterns.forEach(({ ext, pattern, lang }) => {
                if (file.match(ext) && content.includes(pattern) && !file.includes('audit.service.ts')) {
                    issues.push(new AuditIssue('UNAUTHORIZED_LOGS', `Found unauthorized ${lang} log (${pattern}) in: ${file}`, AuditLevel.error(), file));
                }
            });
        });
        return issues;
    }
    checkIncompleteSparcCycles() {
        const issues = [];
        const todoPatterns = ['// TODO', '# TODO', '-- TODO', '/* TODO */'];
        const allFiles = shell.find('.').filter(file => {
            return !file.includes('node_modules') &&
                !file.includes('.ai-core') &&
                !file.includes('dist') &&
                !file.includes('.husky') &&
                !file.includes('README.md');
        });
        allFiles.forEach(file => {
            if (fs.lstatSync(file).isDirectory())
                return;
            const content = fs.readFileSync(file, 'utf-8');
            todoPatterns.forEach(pattern => {
                if (content.includes(pattern) && !file.includes('audit.service.ts')) {
                    issues.push(new AuditIssue('INCOMPLETE_SPARC', `Found incomplete SPARC cycle (${pattern}) in: ${file}`, AuditLevel.error(), file));
                }
            });
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
