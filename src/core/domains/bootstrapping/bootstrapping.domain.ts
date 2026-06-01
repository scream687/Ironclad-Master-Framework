import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel.js';
import { InitService } from './services/init.service.js';
import { ExecService } from './services/exec.service.js';
import { UniversalRulesService } from './services/universal-rules.service.js';
import { RunInitUseCase } from '../../application/use-cases/run-init.use-case.js';
import { RunExecUseCase } from '../../application/use-cases/run-exec.use-case.js';

export class BootstrappingDomain implements Domain {
  readonly name = 'bootstrapping';

  async initialize(container: Container): Promise<void> {
    container.bind<InitService>(InitService).toSelf().inSingletonScope();
    container.bind<ExecService>(ExecService).toSelf().inSingletonScope();
    container.bind<UniversalRulesService>(UniversalRulesService).toSelf().inSingletonScope();
    container.bind<RunInitUseCase>(RunInitUseCase).toSelf().inSingletonScope();
    container.bind<RunExecUseCase>(RunExecUseCase).toSelf().inSingletonScope();
  }
}
