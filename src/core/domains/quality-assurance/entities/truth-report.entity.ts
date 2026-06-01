import { AuditIssue } from './audit-issue.entity';

export interface TruthReport {
  isTrue: boolean;
  confidence: number; // 0.0 to 1.0
  statement: string;
  violations: AuditIssue[];
  hallucinationAlerts: string[];
}
