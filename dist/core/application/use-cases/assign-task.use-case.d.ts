import { TaskRepository } from '../../domains/task-management/repositories/task.repository';
import { EventEmitter } from 'events';
export interface AssignTaskCommand {
    taskId: string;
    agentId: string;
}
export declare class AssignTaskUseCase {
    private taskRepository;
    private eventBus;
    constructor(taskRepository: TaskRepository, eventBus: EventEmitter);
    execute(command: AssignTaskCommand): Promise<void>;
}
