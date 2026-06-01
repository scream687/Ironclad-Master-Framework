import { TaskSchedulingService } from './services/task-scheduling.service';
export class TaskManagementDomain {
    name = 'task-management';
    async initialize(container) {
        container.bind(TaskSchedulingService).toSelf().inSingletonScope();
        // Repositories will be bound here later (Phase 3)
    }
}
