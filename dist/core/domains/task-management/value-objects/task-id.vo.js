import { ValueObject } from '../../../shared/domain/value-object';
export class TaskId extends ValueObject {
    constructor(value) {
        super(value);
    }
    static create() {
        return new TaskId(crypto.randomUUID());
    }
    static fromString(id) {
        if (!id || id.length === 0) {
            throw new Error('TaskId cannot be empty');
        }
        return new TaskId(id);
    }
    get value() {
        return this.props;
    }
}
