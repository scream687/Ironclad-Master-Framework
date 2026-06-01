import { injectable, inject } from 'inversify';
import { InitService } from '../../domains/bootstrapping/services/init.service.js';
import { UniversalRulesService } from '../../domains/bootstrapping/services/universal-rules.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity.js';

@injectable()
export class RunInitUseCase {
  constructor(
    @inject(InitService) private initService: InitService,
    @inject(UniversalRulesService) private rulesService: UniversalRulesService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(targetDir: string): Promise<TruthReport> {
    try {
      await this.initService.ironcladDirectory(targetDir);
      await this.rulesService.syncAllRules(targetDir);
      return this.truthEnforcement.enforceTruth({ success: true }, `Universal initialization: ${targetDir}`);
    } catch (error) {
      return this.truthEnforcement.enforceTruth(error, `Universal initialization: ${targetDir}`);
    }
  }
}
