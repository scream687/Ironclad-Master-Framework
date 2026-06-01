import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { SkillService } from './services/skill.service';
import { DistillationService } from './services/distillation.service';
import { FetchSkillUseCase } from '../../application/use-cases/fetch-skill.use-case';
import { UpgradeFrameworkUseCase } from '../../application/use-cases/upgrade-framework.use-case';

export class IntelligenceHubDomain implements Domain {
  readonly name = 'intelligence-hub';

  async initialize(container: Container): Promise<void> {
    container.bind<SkillService>(SkillService).toSelf().inSingletonScope();
    container.bind<DistillationService>(DistillationService).toSelf().inSingletonScope();
    container.bind<FetchSkillUseCase>(FetchSkillUseCase).toSelf().inSingletonScope();
    container.bind<UpgradeFrameworkUseCase>(UpgradeFrameworkUseCase).toSelf().inSingletonScope();
  }
}
