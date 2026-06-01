import { AuditLevel } from '../value-objects/audit-level.vo';
export declare class AuditIssue {
    readonly ruleName: string;
    readonly message: string;
    readonly level: AuditLevel;
    readonly file?: string | undefined;
    readonly line?: number | undefined;
    constructor(ruleName: string, message: string, level: AuditLevel, file?: string | undefined, line?: number | undefined);
}
