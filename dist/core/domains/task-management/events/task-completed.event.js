import { DomainEvent } from '../../../shared/domain/domain-event';
export class TaskCompletedEvent extends DomainEvent {
    result;
    duration;
    constructor(taskId, result, duration) {
        super(taskId);
        this.result = result;
        this.duration = duration;
    }
}
