import { ValueObject } from '../../../shared/domain/value-object';

export class TaskId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  static fromString(id: string): TaskId {
    if (!id || id.length === 0) {
      throw new Error('TaskId cannot be empty');
    }
    return new TaskId(id);
  }

  override get value(): string {
    return this.props;
  }
}
