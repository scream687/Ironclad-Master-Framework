import { InitService } from '../../domains/bootstrapping/services/init.service.js';
import { UniversalRulesService } from '../../domains/bootstrapping/services/universal-rules.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity.js';
export declare class RunInitUseCase {
    private initService;
    private rulesService;
    private truthEnforcement;
    constructor(initService: InitService, rulesService: UniversalRulesService, truthEnforcement: TruthEnforcementService);
    execute(targetDir: string): Promise<TruthReport>;
}
