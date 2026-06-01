import { ValueObject } from '../../../shared/domain/value-object';
export class TaskStatus extends ValueObject {
    constructor(status) {
        super(status);
    }
    static pending() { return new TaskStatus('pending'); }
    static assigned() { return new TaskStatus('assigned'); }
    static inProgress() { return new TaskStatus('in_progress'); }
    static completed() { return new TaskStatus('completed'); }
    static failed() { return new TaskStatus('failed'); }
    static fromString(status) {
        const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'failed'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid task status: ${status}`);
        }
        return new TaskStatus(status);
    }
    get value() {
        return this.props;
    }
    isPending() { return this.value === 'pending'; }
    isAssigned() { return this.value === 'assigned'; }
    isInProgress() { return this.value === 'in_progress'; }
    isCompleted() { return this.value === 'completed'; }
    isFailed() { return this.value === 'failed'; }
}
