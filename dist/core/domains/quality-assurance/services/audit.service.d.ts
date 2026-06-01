import { AuditResult } from '../entities/audit-result.entity';
export declare class AuditService {
    runFullAudit(): Promise<AuditResult>;
    private checkUnauthorizedLogs;
    private checkIncompleteSparcCycles;
    private checkDirectoryIntegrity;
    private checkRuleSynchronization;
}
