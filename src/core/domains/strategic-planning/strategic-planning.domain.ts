import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { PlanningService } from './services/planning.service';
import { StrategicPlanningService } from './services/strategic-planning.service';

export class StrategicPlanningDomain implements Domain {
  readonly name = 'strategic-planning';

  async initialize(container: Container): Promise<void> {
    container.bind<PlanningService>(PlanningService).toSelf().inSingletonScope();
    container.bind<StrategicPlanningService>(StrategicPlanningService).toSelf().inSingletonScope();
  }
}
