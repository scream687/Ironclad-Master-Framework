import { describe, it, expect } from 'vitest';
import { Task } from './task.entity';
import { Priority } from '../value-objects/priority.vo';

describe('Task metadata', () => {
  it('sets and gets metadata values', () => {
    const task = Task.create('demo', Priority.high());
    task.setMetadata('stagnationCount', 3);
    expect(task.getMetadata<number>('stagnationCount')).toBe(3);
  });

  it('returns undefined for unset keys', () => {
    const task = Task.create('demo', Priority.high());
    expect(task.getMetadata('missing')).toBeUndefined();
  });
});
