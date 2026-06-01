import { Task } from '../entities/task.entity';
export declare class TaskSchedulingService {
    prioritizeTasks(tasks: Task[]): Task[];
    calculateEstimatedDuration(task: Task): number;
}
