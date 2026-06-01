import { GitService } from '../../domains/automation/services/git.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunCommitUseCase {
    private gitService;
    private truthEnforcement;
    constructor(gitService: GitService, truthEnforcement: TruthEnforcementService);
    execute(): Promise<TruthReport>;
}
