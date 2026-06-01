import { ValueObject } from '../../../shared/domain/value-object';
export type AuditLevelType = 'info' | 'warning' | 'error';
export declare class AuditLevel extends ValueObject<AuditLevelType> {
    private constructor();
    static info(): AuditLevel;
    static warning(): AuditLevel;
    static error(): AuditLevel;
    get value(): AuditLevelType;
}
