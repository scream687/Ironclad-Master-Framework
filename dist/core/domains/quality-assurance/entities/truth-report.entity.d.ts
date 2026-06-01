import { AuditIssue } from './audit-issue.entity';
export interface TruthReport {
    isTrue: boolean;
    confidence: number;
    statement: string;
    violations: AuditIssue[];
    hallucinationAlerts: string[];
}
