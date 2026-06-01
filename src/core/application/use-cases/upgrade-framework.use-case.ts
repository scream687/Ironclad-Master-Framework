import { injectable, inject } from 'inversify';
import { DistillationService } from '../../domains/intelligence-hub/services/distillation.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
import { EventEmitter } from 'events';

@injectable()
export class UpgradeFrameworkUseCase {
  constructor(
    @inject(DistillationService) private distillationService: DistillationService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(): Promise<TruthReport> {
    this.eventBus.emit('upgrade_started');
    try {
      await this.distillationService.distillPatterns();
      await this.distillationService.upgradeMandates();
      this.eventBus.emit('upgrade_succeeded');
      return this.truthEnforcement.enforceTruth({ success: true }, 'Evolution loop');
    } catch (error) {
      this.eventBus.emit('upgrade_failed', error);
      return this.truthEnforcement.enforceTruth(error, 'Evolution loop');
    }
  }
}
