import { injectable, inject } from 'inversify';
import { AuditService } from '../../domains/quality-assurance/services/audit.service';
import { AuditResult } from '../../domains/quality-assurance/entities/audit-result.entity';
import { EventEmitter } from 'events';

@injectable()
export class RunAuditUseCase {
  constructor(
    @inject(AuditService) private auditService: AuditService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(): Promise<AuditResult> {
    this.eventBus.emit('audit_started');
    const result = await this.auditService.runFullAudit();
    
    if (result.success) {
      this.eventBus.emit('audit_succeeded', result);
    } else {
      this.eventBus.emit('audit_failed', result);
    }

    return result;
  }
}
