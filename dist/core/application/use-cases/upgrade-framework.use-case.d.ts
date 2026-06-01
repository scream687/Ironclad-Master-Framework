import { DistillationService } from '../../domains/intelligence-hub/services/distillation.service';
import { EventEmitter } from 'events';
export declare class UpgradeFrameworkUseCase {
    private distillationService;
    private eventBus;
    constructor(distillationService: DistillationService, eventBus: EventEmitter);
    execute(): Promise<void>;
}
