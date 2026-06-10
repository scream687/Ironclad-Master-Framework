import { TddService } from './services/tdd.service';
import { GitService } from './services/git.service';
import { DesignService } from './services/design.service';
import { WatchService } from './services/watch.service';
import { DiscoveryService } from './services/discovery.service';
import { HarnessService } from './services/harness.service';
import { InfinityHarnessService } from './services/infinity-harness.service';
import { TaskRepository } from '../task-management/repositories/task.repository';
import { RunTddUseCase } from '../../application/use-cases/run-tdd.use-case';
import { RunCommitUseCase } from '../../application/use-cases/run-commit.use-case';
import { RunDesignUseCase } from '../../application/use-cases/run-design.use-case';
import { RunWatchUseCase } from '../../application/use-cases/run-watch.use-case';
import { RunDiscoveryUseCase } from '../../application/use-cases/run-discovery.use-case';
export class AutomationDomain {
    name = 'automation';
    async initialize(container) {
        container.bind(TddService).toSelf().inSingletonScope();
        container.bind(GitService).toSelf().inSingletonScope();
        container.bind(DiscoveryService).toSelf().inSingletonScope();
        container.bind(DesignService).toSelf().inSingletonScope();
        container.bind(WatchService).toSelf().inSingletonScope();
        container.bind(HarnessService).toSelf().inSingletonScope();
        container.bind(InfinityHarnessService).toSelf().inSingletonScope();
        container.bind(TaskRepository).toSelf().inSingletonScope();
        container.bind(RunTddUseCase).toSelf().inSingletonScope();
        container.bind(RunCommitUseCase).toSelf().inSingletonScope();
        container.bind(RunDesignUseCase).toSelf().inSingletonScope();
        container.bind(RunWatchUseCase).toSelf().inSingletonScope();
        container.bind(RunDiscoveryUseCase).toSelf().inSingletonScope();
    }
}
