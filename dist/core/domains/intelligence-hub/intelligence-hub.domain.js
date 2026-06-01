import { SkillService } from './services/skill.service';
import { DistillationService } from './services/distillation.service';
import { FetchSkillUseCase } from '../../application/use-cases/fetch-skill.use-case';
import { UpgradeFrameworkUseCase } from '../../application/use-cases/upgrade-framework.use-case';
export class IntelligenceHubDomain {
    name = 'intelligence-hub';
    async initialize(container) {
        container.bind(SkillService).toSelf().inSingletonScope();
        container.bind(DistillationService).toSelf().inSingletonScope();
        container.bind(FetchSkillUseCase).toSelf().inSingletonScope();
        container.bind(UpgradeFrameworkUseCase).toSelf().inSingletonScope();
    }
}
