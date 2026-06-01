import { DomainEvent } from '../../../shared/domain/domain-event';
export interface TaskResult {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}
export declare class TaskCompletedEvent extends DomainEvent {
    readonly result: TaskResult;
    readonly duration: number;
    constructor(taskId: string, result: TaskResult, duration: number);
}
