import { describe, it, expect } from 'vitest';
import { Priority } from './priority.vo';

describe('Priority', () => {
  it('creates low priority', () => {
    const p = Priority.low();
    expect(p.value).toBe('low');
    expect(p.getNumericValue()).toBe(1);
  });

  it('creates medium priority', () => {
    const p = Priority.medium();
    expect(p.value).toBe('medium');
    expect(p.getNumericValue()).toBe(2);
  });

  it('creates high priority', () => {
    const p = Priority.high();
    expect(p.value).toBe('high');
    expect(p.getNumericValue()).toBe(3);
  });

  it('creates critical priority', () => {
    const p = Priority.critical();
    expect(p.value).toBe('critical');
    expect(p.getNumericValue()).toBe(4);
  });

  it('creates from valid string', () => {
    expect(Priority.fromString('low').value).toBe('low');
    expect(Priority.fromString('high').value).toBe('high');
  });

  it('throws on invalid string', () => {
    expect(() => Priority.fromString('invalid')).toThrow('Invalid priority level: invalid');
  });

  it('supports equality comparison', () => {
    expect(Priority.low().equals(Priority.low())).toBe(true);
    expect(Priority.low().equals(Priority.high())).toBe(false);
  });
});
