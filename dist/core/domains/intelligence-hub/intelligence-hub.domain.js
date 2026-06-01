import { SkillService } from './services/skill.service';
import { DistillationService } from './services/distillation.service';
import { TruthEnforcementService } from '../quality-assurance/services/truth-enforcement.service';
import { FetchSkillUseCase } from '../../application/use-cases/fetch-skill.use-case';
import { UpgradeFrameworkUseCase } from '../../application/use-cases/upgrade-framework.use-case';
export class IntelligenceHubDomain {
    name = 'intelligence-hub';
    async initialize(container) {
        container.bind(SkillService).toSelf().inSingletonScope();
        container.bind(DistillationService).toSelf().inSingletonScope();
        // Use cases with Truth Factor
        const skillService = container.get(SkillService);
        const distillationService = container.get(DistillationService);
        const truthEnforcement = container.get(TruthEnforcementService);
        const eventBus = container.get('EventBus');
        container.bind(FetchSkillUseCase).toConstantValue(new FetchSkillUseCase(skillService, truthEnforcement, eventBus));
        container.bind(UpgradeFrameworkUseCase).toConstantValue(new UpgradeFrameworkUseCase(distillationService, truthEnforcement, eventBus));
    }
}
