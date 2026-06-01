import { TddService } from '../../domains/automation/services/tdd.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunTddUseCase {
    private tddService;
    private truthEnforcement;
    constructor(tddService: TddService, truthEnforcement: TruthEnforcementService);
    execute(feature: string): Promise<TruthReport>;
}
