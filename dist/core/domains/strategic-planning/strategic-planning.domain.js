import { PlanningService } from './services/planning.service';
export class StrategicPlanningDomain {
    name = 'strategic-planning';
    async initialize(container) {
        container.bind(PlanningService).toSelf().inSingletonScope();
    }
}
