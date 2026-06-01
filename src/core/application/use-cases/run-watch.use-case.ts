import { injectable, inject } from 'inversify';
import { WatchService } from '../../domains/automation/services/watch.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunWatchUseCase {
  constructor(
    @inject(WatchService) private watchService: WatchService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(): Promise<TruthReport> {
    await this.watchService.startDaemon();
    return this.truthEnforcement.enforceTruth({ success: true }, 'Watch daemon: Active');
  }
}
