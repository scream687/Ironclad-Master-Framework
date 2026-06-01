import { ValueObject } from '../../../shared/domain/value-object';
export class Priority extends ValueObject {
    constructor(level) {
        super(level);
    }
    static low() { return new Priority('low'); }
    static medium() { return new Priority('medium'); }
    static high() { return new Priority('high'); }
    static critical() { return new Priority('critical'); }
    static fromString(level) {
        const validLevels = ['low', 'medium', 'high', 'critical'];
        if (!validLevels.includes(level)) {
            throw new Error(`Invalid priority level: ${level}`);
        }
        return new Priority(level);
    }
    get value() {
        return this.props;
    }
    getNumericValue() {
        const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
        return priorities[this.value];
    }
}
