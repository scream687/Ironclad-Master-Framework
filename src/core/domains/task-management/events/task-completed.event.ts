import { DomainEvent } from '../../../shared/domain/domain-event';

export interface TaskResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export class TaskCompletedEvent extends DomainEvent {
  constructor(
    taskId: string,
    public readonly result: TaskResult,
    public readonly duration: number
  ) {
    super(taskId);
  }
}
