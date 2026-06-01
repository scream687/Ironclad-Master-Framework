import { AuditLevel } from '../value-objects/audit-level.vo';

export class AuditIssue {
  constructor(
    public readonly ruleName: string,
    public readonly message: string,
    public readonly level: AuditLevel,
    public readonly file?: string,
    public readonly line?: number
  ) {}
}
