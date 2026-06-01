import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { TaskSchedulingService } from './services/task-scheduling.service';

export class TaskManagementDomain implements Domain {
  readonly name = 'task-management';

  async initialize(container: Container): Promise<void> {
    container.bind<TaskSchedulingService>(TaskSchedulingService).toSelf().inSingletonScope();
    // Repositories will be bound here later (Phase 3)
  }
}
