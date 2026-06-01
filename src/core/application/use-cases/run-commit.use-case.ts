import { injectable, inject } from 'inversify';
import { GitService } from '../../domains/automation/services/git.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunCommitUseCase {
  constructor(
    @inject(GitService) private gitService: GitService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(): Promise<TruthReport> {
    const message = await this.gitService.generateEliteCommit();
    if (message === 'No changes to commit.') {
      return this.truthEnforcement.enforceTruth({ success: true }, 'Git automation: Idle');
    }
    await this.gitService.commitAndPush(message);
    return this.truthEnforcement.enforceTruth({ success: true }, `Git automation: ${message}`);
  }
}
