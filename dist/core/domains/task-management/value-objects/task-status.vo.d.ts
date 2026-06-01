import { ValueObject } from '../../../shared/domain/value-object';
type TaskStatusType = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';
export declare class TaskStatus extends ValueObject<TaskStatusType> {
    private constructor();
    static pending(): TaskStatus;
    static assigned(): TaskStatus;
    static inProgress(): TaskStatus;
    static completed(): TaskStatus;
    static failed(): TaskStatus;
    static fromString(status: string): TaskStatus;
    get value(): TaskStatusType;
    isPending(): boolean;
    isAssigned(): boolean;
    isInProgress(): boolean;
    isCompleted(): boolean;
    isFailed(): boolean;
}
export {};
