import { PlanningService } from '../../domains/strategic-planning/services/planning.service';
import { EventEmitter } from 'events';
export declare class BrainstormUseCase {
    private planningService;
    private eventBus;
    constructor(planningService: PlanningService, eventBus: EventEmitter);
    execute(topic: string): Promise<string[]>;
}
