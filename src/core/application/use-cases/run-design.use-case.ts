import { injectable, inject } from 'inversify';
import { DesignService } from '../../domains/automation/services/design.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunDesignUseCase {
  constructor(
    @inject(DesignService) private designService: DesignService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(path: string): Promise<TruthReport> {
    const findings = await this.designService.auditFrontendAesthetics(path);
    return this.truthEnforcement.enforceTruth({ success: true }, `Design audit: ${path}`);
  }
}
