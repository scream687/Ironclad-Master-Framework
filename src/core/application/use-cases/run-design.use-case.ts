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
    
    // Check for "TRUTH" violations in findings
    const hasBreach = findings.some(f => f.startsWith('TRUTH:'));
    const success = !hasBreach;

    return this.truthEnforcement.enforceTruth(
      { success, issues: findings.map(f => ({ message: f, level: { value: f.startsWith('TRUTH:') ? 'error' : 'warning' } })) }, 
      `Design audit: ${path}`
    );
  }
}
