import { describe, it, expect } from 'vitest';
import { TaskStatus } from './task-status.vo';

describe('TaskStatus', () => {
  it('creates pending status', () => {
    const s = TaskStatus.pending();
    expect(s.value).toBe('pending');
    expect(s.isPending()).toBe(true);
  });

  it('creates assigned status', () => {
    const s = TaskStatus.assigned();
    expect(s.value).toBe('assigned');
    expect(s.isAssigned()).toBe(true);
  });

  it('creates in_progress status', () => {
    const s = TaskStatus.inProgress();
    expect(s.value).toBe('in_progress');
    expect(s.isInProgress()).toBe(true);
  });

  it('creates completed status', () => {
    const s = TaskStatus.completed();
    expect(s.value).toBe('completed');
    expect(s.isCompleted()).toBe(true);
  });

  it('creates failed status', () => {
    const s = TaskStatus.failed();
    expect(s.value).toBe('failed');
    expect(s.isFailed()).toBe(true);
  });

  it('creates from valid string', () => {
    expect(TaskStatus.fromString('pending').value).toBe('pending');
    expect(TaskStatus.fromString('completed').value).toBe('completed');
  });

  it('throws on invalid string', () => {
    expect(() => TaskStatus.fromString('invalid')).toThrow('Invalid task status: invalid');
  });

  it('checks status correctly', () => {
    const pending = TaskStatus.pending();
    expect(pending.isPending()).toBe(true);
    expect(pending.isCompleted()).toBe(false);
  });
});
