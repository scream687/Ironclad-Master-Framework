import { ExecService } from '../../domains/bootstrapping/services/exec.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunExecUseCase {
    private execService;
    private truthEnforcement;
    constructor(execService: ExecService, truthEnforcement: TruthEnforcementService);
    execute(command: string, args: string[]): Promise<TruthReport>;
}
