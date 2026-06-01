import { TddService } from './services/tdd.service';
import { GitService } from './services/git.service';
import { DesignService } from './services/design.service';
import { WatchService } from './services/watch.service';
import { RunTddUseCase } from '../../application/use-cases/run-tdd.use-case';
import { RunCommitUseCase } from '../../application/use-cases/run-commit.use-case';
import { RunDesignUseCase } from '../../application/use-cases/run-design.use-case';
import { RunWatchUseCase } from '../../application/use-cases/run-watch.use-case';
export class AutomationDomain {
    name = 'automation';
    async initialize(container) {
        container.bind(TddService).toSelf().inSingletonScope();
        container.bind(GitService).toSelf().inSingletonScope();
        container.bind(DesignService).toSelf().inSingletonScope();
        container.bind(WatchService).toSelf().inSingletonScope();
        container.bind(RunTddUseCase).toSelf().inSingletonScope();
        container.bind(RunCommitUseCase).toSelf().inSingletonScope();
        container.bind(RunDesignUseCase).toSelf().inSingletonScope();
        container.bind(RunWatchUseCase).toSelf().inSingletonScope();
    }
}
