import { PlanningService } from '../../domains/strategic-planning/services/planning.service';
import { EventEmitter } from 'events';
export declare class GeneratePlanUseCase {
    private planningService;
    private eventBus;
    constructor(planningService: PlanningService, eventBus: EventEmitter);
    execute(goal: string, context: string): Promise<{
        path: string;
        content: string;
    }>;
}
