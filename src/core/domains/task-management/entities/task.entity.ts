import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { Priority } from '../value-objects/priority.vo';
import { TaskAssignedEvent } from '../events/task-assigned.event';
import { TaskCompletedEvent, TaskResult } from '../events/task-completed.event';

interface TaskProps {
  id: TaskId;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignedAgentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Task extends AggregateRoot<TaskId> {
  private props: TaskProps;

  private constructor(props: TaskProps) {
    super(props.id);
    this.props = props;
  }

  static create(description: string, priority: Priority): Task {
    const task = new Task({
      id: TaskId.create(),
      description,
      priority,
      status: TaskStatus.pending(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return task;
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props);
  }

  public assignTo(agentId: string): void {
    if (this.props.status.isCompleted()) {
      throw new Error('Cannot assign completed task');
    }

    this.props.assignedAgentId = agentId;
    this.props.status = TaskStatus.assigned();
    this.props.updatedAt = new Date();

    this.applyEvent(new TaskAssignedEvent(
      this.id.value,
      agentId,
      this.props.priority
    ));
  }

  public complete(result: TaskResult): void {
    if (!this.props.assignedAgentId) {
      throw new Error('Cannot complete unassigned task');
    }

    this.props.status = TaskStatus.completed();
    this.props.updatedAt = new Date();

    this.applyEvent(new TaskCompletedEvent(
      this.id.value,
      result,
      this.calculateDuration()
    ));
  }

  // Getters
  get description(): string { return this.props.description; }
  get priority(): Priority { return this.props.priority; }
  get status(): TaskStatus { return this.props.status; }
  get assignedAgentId(): string | undefined { return this.props.assignedAgentId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  private calculateDuration(): number {
    return this.props.updatedAt.getTime() - this.props.createdAt.getTime();
  }
}
