import { injectable } from 'inversify';
import { Task } from '../entities/task.entity';
import { Priority } from '../value-objects/priority.vo';

@injectable()
export class TaskSchedulingService {
  public prioritizeTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
      b.priority.getNumericValue() - a.priority.getNumericValue()
    );
  }

  public calculateEstimatedDuration(task: Task): number {
    const baseTime = 300000; // 5 minutes
    const priorityMultiplier: Record<string, number> = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      critical: 2.0
    };

    return baseTime * (priorityMultiplier[task.priority.value] || 1.0);
  }
}
