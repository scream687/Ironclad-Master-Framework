import { AuditIssue } from './audit-issue.entity';

export class AuditResult {
  constructor(
    public readonly issues: AuditIssue[] = [],
    public readonly startedAt: Date = new Date(),
    public readonly finishedAt: Date = new Date()
  ) {}

  get success(): boolean {
    return !this.issues.some(issue => issue.level.value === 'error');
  }

  get errorCount(): number {
    return this.issues.filter(issue => issue.level.value === 'error').length;
  }

  get warningCount(): number {
    return this.issues.filter(issue => issue.level.value === 'warning').length;
  }
}
