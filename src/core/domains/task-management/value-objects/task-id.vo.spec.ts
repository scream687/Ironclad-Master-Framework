import { describe, it, expect } from 'vitest';
import { TaskId } from './task-id.vo';

describe('TaskId', () => {
  it('creates random UUID', () => {
    const id = TaskId.create();
    expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('creates from valid string', () => {
    const id = TaskId.fromString('task-123');
    expect(id.value).toBe('task-123');
  });

  it('throws on empty string', () => {
    expect(() => TaskId.fromString('')).toThrow('TaskId cannot be empty');
  });

  it('supports equality comparison', () => {
    const id1 = TaskId.fromString('task-1');
    const id2 = TaskId.fromString('task-1');
    const id3 = TaskId.fromString('task-2');
    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});
