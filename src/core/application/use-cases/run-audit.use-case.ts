import { injectable, inject } from 'inversify';
import { AuditService } from '../../domains/quality-assurance/services/audit.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { AuditResult } from '../../domains/quality-assurance/entities/audit-result.entity';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
import { EventEmitter } from 'events';

@injectable()
export class RunAuditUseCase {
  constructor(
    @inject(AuditService) private auditService: AuditService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService,
    @inject('EventBus') private eventBus: EventEmitter
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
