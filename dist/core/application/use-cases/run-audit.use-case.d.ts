import { AuditService } from '../../domains/quality-assurance/services/audit.service';
import { AuditResult } from '../../domains/quality-assurance/entities/audit-result.entity';
import { EventEmitter } from 'events';
export declare class RunAuditUseCase {
    private auditService;
    private eventBus;
    constructor(auditService: AuditService, eventBus: EventEmitter);
    execute(): Promise<AuditResult>;
}
