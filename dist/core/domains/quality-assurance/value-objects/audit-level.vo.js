import { ValueObject } from '../../../shared/domain/value-object';
export class AuditLevel extends ValueObject {
    constructor(level) {
        super(level);
    }
    static info() { return new AuditLevel('info'); }
    static warning() { return new AuditLevel('warning'); }
    static error() { return new AuditLevel('error'); }
    get value() {
        return this.props;
    }
}
