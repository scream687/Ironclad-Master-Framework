import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { Priority } from '../value-objects/priority.vo';
import { TaskResult } from '../events/task-completed.event';
interface TaskProps {
    id: TaskId;
    parentId?: string | undefined;
    description: string;
    priority: Priority;
    status: TaskStatus;
    metadata: Record<string, any>;
    assignedAgentId?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Task extends AggregateRoot<TaskId> {
    private props;
    private constructor();
    static create(description: string, priority: Priority, parentId?: string): Task;
    static reconstitute(props: TaskProps): Task;
    assignTo(agentId: string): void;
    complete(result: TaskResult): void;
    get description(): string;
    get priority(): Priority;
    get status(): TaskStatus;
    get assignedAgentId(): string | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    private calculateDuration;
}
export {};
