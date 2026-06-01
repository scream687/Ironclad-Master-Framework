import { injectable, decorate, inject } from 'inversify';
import { AuditService } from '../../domains/quality-assurance/services/audit.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
import { AuditResult } from '../../domains/quality-assurance/entities/audit-result.entity.js';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity.js';
import { EventEmitter } from 'events';

@injectable()
export class RunAuditUseCase {
  constructor(
    private auditService: AuditService,
    private truthEnforcement: TruthEnforcementService,
    private eventBus: EventEmitter
  ) {}

  async execute(): Promise<{ result: AuditResult; truth: TruthReport }> {
    this.eventBus.emit('audit_started');
    const result = await this.auditService.runFullAudit();
    const truth = this.truthEnforcement.enforceTruth(result, 'Audit cycle');
    
    if (result.success) {
      this.eventBus.emit('audit_succeeded', result);
    } else {
      this.eventBus.emit('audit_failed', result);
    }

    return { result, truth };
  }
}

decorate(inject(AuditService), RunAuditUseCase, 0);
decorate(inject(TruthEnforcementService), RunAuditUseCase, 1);
decorate(inject('EventBus'), RunAuditUseCase, 2);
