import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { InitService } from './services/init.service';
import { ExecService } from './services/exec.service';
import { RunInitUseCase } from '../../application/use-cases/run-init.use-case';
import { RunExecUseCase } from '../../application/use-cases/run-exec.use-case';

export class BootstrappingDomain implements Domain {
  readonly name = 'bootstrapping';

  async initialize(container: Container): Promise<void> {
    container.bind<InitService>(InitService).toSelf().inSingletonScope();
    container.bind<ExecService>(ExecService).toSelf().inSingletonScope();
    container.bind<RunInitUseCase>(RunInitUseCase).toSelf().inSingletonScope();
    container.bind<RunExecUseCase>(RunExecUseCase).toSelf().inSingletonScope();
  }
}
