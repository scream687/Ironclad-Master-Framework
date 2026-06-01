import { WatchService } from '../../domains/automation/services/watch.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunWatchUseCase {
    private watchService;
    private truthEnforcement;
    constructor(watchService: WatchService, truthEnforcement: TruthEnforcementService);
    execute(): Promise<TruthReport>;
}
