import { ValueObject } from '../../../shared/domain/value-object';

type TaskStatusType = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';

export class TaskStatus extends ValueObject<TaskStatusType> {
  private constructor(status: TaskStatusType) {
    super(status);
  }

  static pending(): TaskStatus { return new TaskStatus('pending'); }
  static assigned(): TaskStatus { return new TaskStatus('assigned'); }
  static inProgress(): TaskStatus { return new TaskStatus('in_progress'); }
  static completed(): TaskStatus { return new TaskStatus('completed'); }
  static failed(): TaskStatus { return new TaskStatus('failed'); }

  static fromString(status: string): TaskStatus {
    const validStatuses: TaskStatusType[] = ['pending', 'assigned', 'in_progress', 'completed', 'failed'];
    if (!validStatuses.includes(status as TaskStatusType)) {
      throw new Error(`Invalid task status: ${status}`);
    }
    return new TaskStatus(status as TaskStatusType);
  }

  override get value(): TaskStatusType {
    return this.props;
  }

  public isPending(): boolean { return this.value === 'pending'; }
  public isAssigned(): boolean { return this.value === 'assigned'; }
  public isInProgress(): boolean { return this.value === 'in_progress'; }
  public isCompleted(): boolean { return this.value === 'completed'; }
  public isFailed(): boolean { return this.value === 'failed'; }
}
