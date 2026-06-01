import { injectable, inject } from 'inversify';
import { DistillationService } from '../../domains/intelligence-hub/services/distillation.service';
import { EventEmitter } from 'events';

@injectable()
export class UpgradeFrameworkUseCase {
  constructor(
    @inject(DistillationService) private distillationService: DistillationService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(): Promise<void> {
    this.eventBus.emit('upgrade_started');
    try {
      await this.distillationService.distillPatterns();
      await this.distillationService.upgradeMandates();
      this.eventBus.emit('upgrade_succeeded');
    } catch (error) {
      this.eventBus.emit('upgrade_failed', error);
      throw error;
    }
  }
}
