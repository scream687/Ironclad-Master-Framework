import { AuditIssue } from './audit-issue.entity';
export declare class AuditResult {
    readonly issues: AuditIssue[];
    readonly startedAt: Date;
    readonly finishedAt: Date;
    constructor(issues?: AuditIssue[], startedAt?: Date, finishedAt?: Date);
    get success(): boolean;
    get errorCount(): number;
    get warningCount(): number;
}
