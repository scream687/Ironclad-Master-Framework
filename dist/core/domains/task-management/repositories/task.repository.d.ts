import { Task } from '../entities/task.entity';
export declare class TaskRepository {
    private agentDB;
    constructor(agentDB: any);
    save(task: any): Promise<void>;
    findById(id: string): Promise<Task | null>;
    findPendingSubTasks(parentId: string): Promise<Task[]>;
}
