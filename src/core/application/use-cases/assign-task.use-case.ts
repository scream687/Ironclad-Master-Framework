import { injectable, inject } from 'inversify';
import { TaskRepository } from '../../domains/task-management/repositories/task.repository';
import { TaskId } from '../../domains/task-management/value-objects/task-id.vo';
import { EventEmitter } from 'events';

export interface AssignTaskCommand {
  taskId: string;
  agentId: string;
}

@injectable()
export class AssignTaskUseCase {
  constructor(
    @inject(TaskRepository) private taskRepository: TaskRepository,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(command: AssignTaskCommand): Promise<void> {
    const taskId = TaskId.fromString(command.taskId);
    const task = await this.taskRepository.findById(taskId.value);

    if (!task) {
      throw new Error(`Task ${command.taskId} not found`);
    }

    task.assignTo(command.agentId);
    await this.taskRepository.save(task);

    // Publish domain events
    for (const event of task.getUncommittedEvents()) {
      this.eventBus.emit(event.constructor.name, event);
    }
    
    task.markEventsAsCommitted();
  }
}
