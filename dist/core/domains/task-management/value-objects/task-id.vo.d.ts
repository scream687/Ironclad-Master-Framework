import { ValueObject } from '../../../shared/domain/value-object';
export declare class TaskId extends ValueObject<string> {
    private constructor();
    static create(): TaskId;
    static fromString(id: string): TaskId;
    get value(): string;
}
