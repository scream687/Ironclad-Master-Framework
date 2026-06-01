import { Task } from '../entities/task.entity';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
export interface ITaskRepository {
    save(task: Task): Promise<void>;
    findById(id: TaskId): Promise<Task | null>;
    findByAgentId(agentId: string): Promise<Task[]>;
    findByStatus(status: TaskStatus): Promise<Task[]>;
    findPendingTasks(): Promise<Task[]>;
    delete(id: TaskId): Promise<void>;
}
