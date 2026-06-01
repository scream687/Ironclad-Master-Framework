import { InitService } from '../../domains/bootstrapping/services/init.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunInitUseCase {
    private initService;
    private truthEnforcement;
    constructor(initService: InitService, truthEnforcement: TruthEnforcementService);
    execute(targetDir: string): Promise<TruthReport>;
}
