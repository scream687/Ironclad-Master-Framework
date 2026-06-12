import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AgentDBService } from './agent-db.service';
import fs from 'fs';
import path from 'path';

describe('AgentDBService', () => {
  let service: AgentDBService;
  const testDbPath = path.resolve('.ai-core', 'memory.db');

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    service = new AgentDBService();
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('initializes database and schema', () => {
    expect(fs.existsSync(testDbPath)).toBe(true);
  });

  it('records a thought', () => {
    service.recordThought('task-1', 'test thought');
    // If no error thrown, recording succeeded
  });

  it('stores a memory entry', async () => {
    await service.store({
      id: 'mem-1',
      content: 'test content',
      metadata: '{}',
      createdAt: Date.now()
    });
    // If no error thrown, storage succeeded
  });

  it('searches memories', async () => {
    await service.store({
      id: 'mem-1',
      content: 'searchable content',
      metadata: '{}',
      createdAt: Date.now()
    });
    const results = await service.search('searchable', 10);
    expect(Array.isArray(results)).toBe(true);
  });
});
