import { ValueObject } from '../../../shared/domain/value-object';

export type AuditLevelType = 'info' | 'warning' | 'error';

export class AuditLevel extends ValueObject<AuditLevelType> {
  private constructor(level: AuditLevelType) {
    super(level);
  }

  static info(): AuditLevel { return new AuditLevel('info'); }
  static warning(): AuditLevel { return new AuditLevel('warning'); }
  static error(): AuditLevel { return new AuditLevel('error'); }

  override get value(): AuditLevelType {
    return this.props;
  }
}
