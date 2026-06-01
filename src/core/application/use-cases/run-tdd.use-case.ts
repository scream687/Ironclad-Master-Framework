import { injectable, inject } from 'inversify';
import { TddService } from '../../domains/automation/services/tdd.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunTddUseCase {
  constructor(
    @inject(TddService) private tddService: TddService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(feature: string): Promise<TruthReport> {
    const success = await this.tddService.runTracerBullet(feature);
    return this.truthEnforcement.enforceTruth({ success }, `TDD cycle: ${feature}`);
  }
}
