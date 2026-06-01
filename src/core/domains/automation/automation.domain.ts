import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { TddService } from './services/tdd.service';
import { GitService } from './services/git.service';
import { DesignService } from './services/design.service';
import { WatchService } from './services/watch.service';
import { DiscoveryService } from './services/discovery.service';
import { RunTddUseCase } from '../../application/use-cases/run-tdd.use-case';
import { RunCommitUseCase } from '../../application/use-cases/run-commit.use-case';
import { RunDesignUseCase } from '../../application/use-cases/run-design.use-case';
import { RunWatchUseCase } from '../../application/use-cases/run-watch.use-case';
import { RunDiscoveryUseCase } from '../../application/use-cases/run-discovery.use-case';

export class AutomationDomain implements Domain {
  readonly name = 'automation';

  async initialize(container: Container): Promise<void> {
    container.bind<TddService>(TddService).toSelf().inSingletonScope();
    container.bind<GitService>(GitService).toSelf().inSingletonScope();
    container.bind<DiscoveryService>(DiscoveryService).toSelf().inSingletonScope();
    container.bind<DesignService>(DesignService).toSelf().inSingletonScope();
    container.bind<WatchService>(WatchService).toSelf().inSingletonScope();
    
    container.bind<RunTddUseCase>(RunTddUseCase).toSelf().inSingletonScope();
    container.bind<RunCommitUseCase>(RunCommitUseCase).toSelf().inSingletonScope();
    container.bind<RunDesignUseCase>(RunDesignUseCase).toSelf().inSingletonScope();
    container.bind<RunWatchUseCase>(RunWatchUseCase).toSelf().inSingletonScope();
    container.bind<RunDiscoveryUseCase>(RunDiscoveryUseCase).toSelf().inSingletonScope();
  }
}
