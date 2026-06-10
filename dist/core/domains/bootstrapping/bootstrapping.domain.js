import { InitService } from './services/init.service.js';
import { ExecService } from './services/exec.service.js';
import { UniversalRulesService } from './services/universal-rules.service.js';
import { RunInitUseCase } from '../../application/use-cases/run-init.use-case.js';
import { RunExecUseCase } from '../../application/use-cases/run-exec.use-case.js';
export class BootstrappingDomain {
    name = 'bootstrapping';
    async initialize(container) {
        container.bind(InitService).toSelf().inSingletonScope();
        container.bind(ExecService).toSelf().inSingletonScope();
        container.bind(UniversalRulesService).toSelf().inSingletonScope();
        container.bind(RunInitUseCase).toSelf().inSingletonScope();
        container.bind(RunExecUseCase).toSelf().inSingletonScope();
    }
}
