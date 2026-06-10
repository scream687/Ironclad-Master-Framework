import { injectable, inject } from 'inversify';
import { PlanningService } from '../../domains/strategic-planning/services/planning.service';
import { EventEmitter } from 'events';

@injectable()
export class GeneratePlanUseCase {
  constructor(
    @inject(PlanningService) private planningService: PlanningService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(goal: string, context: string): Promise<{ path: string; content: string }> {
    const result = await this.planningService.generateSparcSpec(goal, context);
    this.eventBus.emit('plan_generated', result.path);
    return result;
  }
}
