import { ValueObject } from '../../../shared/domain/value-object';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export class Priority extends ValueObject<PriorityLevel> {
  private constructor(level: PriorityLevel) {
    super(level);
  }

  static low(): Priority { return new Priority('low'); }
  static medium(): Priority { return new Priority('medium'); }
  static high(): Priority { return new Priority('high'); }
  static critical(): Priority { return new Priority('critical'); }

  static fromString(level: string): Priority {
    const validLevels: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];
    if (!validLevels.includes(level as PriorityLevel)) {
      throw new Error(`Invalid priority level: ${level}`);
    }
    return new Priority(level as PriorityLevel);
  }

  override get value(): PriorityLevel {
    return this.props;
  }

  public getNumericValue(): number {
    const priorities: Record<PriorityLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[this.value];
  }
}
