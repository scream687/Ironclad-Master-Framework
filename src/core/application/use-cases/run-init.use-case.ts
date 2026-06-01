import { injectable, inject } from 'inversify';
import { InitService } from '../../domains/bootstrapping/services/init.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunInitUseCase {
  constructor(
    @inject(InitService) private initService: InitService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(targetDir: string): Promise<TruthReport> {
    try {
      await this.initService.ironcladDirectory(targetDir);
      return this.truthEnforcement.enforceTruth({ success: true }, `Project initialization: ${targetDir}`);
    } catch (error) {
      return this.truthEnforcement.enforceTruth(error, `Project initialization: ${targetDir}`);
    }
  }
}
