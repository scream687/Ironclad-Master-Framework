import { DomainEvent } from '../../../shared/domain/domain-event';
export class TaskAssignedEvent extends DomainEvent {
    agentId;
    priority;
    constructor(taskId, agentId, priority) {
        super(taskId);
        this.agentId = agentId;
        this.priority = priority;
    }
}
