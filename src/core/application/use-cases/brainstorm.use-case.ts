import { injectable, inject } from 'inversify';
import { PlanningService } from '../../domains/strategic-planning/services/planning.service';
import { EventEmitter } from 'events';

@injectable()
export class BrainstormUseCase {
  constructor(
    @inject(PlanningService) private planningService: PlanningService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(topic: string): Promise<string[]> {
    const ideas = await this.planningService.brainstorm(topic);
    this.eventBus.emit('brainstorm_completed', topic);
    return ideas;
  }
}
