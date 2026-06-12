import { describe, it, expect, beforeEach } from 'vitest';
import { TaskRepository } from './task.repository';
import { AgentDBService } from '../../memory/services/agent-db.service';
import { Task } from '../entities/task.entity';
import { Priority } from '../value-objects/priority.vo';

describe('TaskRepository', () => {
  let repo: TaskRepository;
  let db: AgentDBService;

  beforeEach(() => {
    db = new AgentDBService();
    repo = new TaskRepository(db);
  });

  it('saves a task', async () => {
    const task = Task.create('test task', Priority.high());
    await repo.save(task);
    const found = await repo.findById(task.id.value);
    expect(found).not.toBeNull();
    expect(found!.description).toBe('test task');
  });

  it('returns null for non-existent task', async () => {
    const found = await repo.findById('non-existent');
    expect(found).toBeNull();
  });

  it('finds pending subtasks', async () => {
    const parent = Task.create('parent', Priority.high());
    const child = Task.create('child', Priority.medium(), parent.id.value);
    await repo.save(parent);
    await repo.save(child);
    
    const subtasks = await repo.findPendingSubTasks(parent.id.value);
    expect(subtasks.length).toBeGreaterThan(0);
    expect(subtasks[0].description).toBe('child');
  });
});
