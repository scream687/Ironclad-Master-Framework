import { DistillationService } from '../../domains/intelligence-hub/services/distillation.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
import { EventEmitter } from 'events';
export declare class UpgradeFrameworkUseCase {
    private distillationService;
    private truthEnforcement;
    private eventBus;
    constructor(distillationService: DistillationService, truthEnforcement: TruthEnforcementService, eventBus: EventEmitter);
    execute(): Promise<TruthReport>;
}
