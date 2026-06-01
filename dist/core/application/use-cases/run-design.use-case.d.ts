import { DesignService } from '../../domains/automation/services/design.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunDesignUseCase {
    private designService;
    private truthEnforcement;
    constructor(designService: DesignService, truthEnforcement: TruthEnforcementService);
    execute(path: string): Promise<TruthReport>;
}
