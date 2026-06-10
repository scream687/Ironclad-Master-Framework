import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { TaskAssignedEvent } from '../events/task-assigned.event';
import { TaskCompletedEvent } from '../events/task-completed.event';
export class Task extends AggregateRoot {
    props;
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    static create(description, priority, parentId) {
        const task = new Task({
            id: TaskId.create(),
            parentId,
            description,
            priority,
            status: TaskStatus.pending(),
            metadata: {},
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return task;
    }
    static reconstitute(props) {
        return new Task(props);
    }
    assignTo(agentId) {
        if (this.props.status.isCompleted()) {
            throw new Error('Cannot assign completed task');
        }
        this.props.assignedAgentId = agentId;
        this.props.status = TaskStatus.assigned();
        this.props.updatedAt = new Date();
        this.applyEvent(new TaskAssignedEvent(this.id.value, agentId, this.props.priority));
    }
    complete(result) {
        if (!this.props.assignedAgentId) {
            throw new Error('Cannot complete unassigned task');
        }
        this.props.status = TaskStatus.completed();
        this.props.updatedAt = new Date();
        this.applyEvent(new TaskCompletedEvent(this.id.value, result, this.calculateDuration()));
    }
    // Getters
    get description() { return this.props.description; }
    get priority() { return this.props.priority; }
    get status() { return this.props.status; }
    get assignedAgentId() { return this.props.assignedAgentId; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    calculateDuration() {
        return this.props.updatedAt.getTime() - this.props.createdAt.getTime();
    }
}
