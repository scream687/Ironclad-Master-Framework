import { DomainEvent } from '../../../shared/domain/domain-event';
import { Priority } from '../value-objects/priority.vo';
export declare class TaskAssignedEvent extends DomainEvent {
    readonly agentId: string;
    readonly priority: Priority;
    constructor(taskId: string, agentId: string, priority: Priority);
}
