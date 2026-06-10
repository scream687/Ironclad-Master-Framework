import { AuditService } from '../../domains/quality-assurance/services/audit.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
import { AuditResult } from '../../domains/quality-assurance/entities/audit-result.entity.js';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity.js';
import { EventEmitter } from 'events';
export declare class RunAuditUseCase {
    private auditService;
    private truthEnforcement;
    private eventBus;
    constructor(auditService: AuditService, truthEnforcement: TruthEnforcementService, eventBus: EventEmitter);
    execute(): Promise<{
        result: AuditResult;
        truth: TruthReport;
    }>;
}
