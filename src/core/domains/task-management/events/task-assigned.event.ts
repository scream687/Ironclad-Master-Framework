import { DomainEvent } from '../../../shared/domain/domain-event';
import { Priority } from '../value-objects/priority.vo';

export class TaskAssignedEvent extends DomainEvent {
  constructor(
    taskId: string,
    public readonly agentId: string,
    public readonly priority: Priority
  ) {
    super(taskId);
  }
}
