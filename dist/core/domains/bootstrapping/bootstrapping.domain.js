import { InitService } from './services/init.service';
import { ExecService } from './services/exec.service';
import { RunInitUseCase } from '../../application/use-cases/run-init.use-case';
import { RunExecUseCase } from '../../application/use-cases/run-exec.use-case';
export class BootstrappingDomain {
    name = 'bootstrapping';
    async initialize(container) {
        container.bind(InitService).toSelf().inSingletonScope();
        container.bind(ExecService).toSelf().inSingletonScope();
        container.bind(RunInitUseCase).toSelf().inSingletonScope();
        container.bind(RunExecUseCase).toSelf().inSingletonScope();
    }
}
