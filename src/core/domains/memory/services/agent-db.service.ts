import { injectable } from 'inversify';
import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface MemoryEntry {
  id: string;
  content: string;
  metadata: string;
  embedding?: Buffer;
  createdAt: number;
}

@injectable()
export class AgentDBService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.resolve('.ai-core', 'memory.db');
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.db = new Database(dbPath);
    this.initializeSchema();
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        metadata TEXT,
        embedding BLOB,
        created_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS thoughts (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        thought TEXT NOT NULL,
        tool_snapshot TEXT,
        created_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_thoughts_task_id ON thoughts(task_id)`);
  }

  public recordThought(taskId: string, thought: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO thoughts (id, task_id, thought, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(`thought-${randomUUID()}`, taskId, thought, Date.now());
  }

  public async store(entry: MemoryEntry): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO memories (id, content, metadata, embedding, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(entry.id, entry.content, entry.metadata, entry.embedding, entry.createdAt);
  }

  public async search(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    // Basic text search for now since we don't have HNSW yet
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE content LIKE ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(`%${query}%`, limit) as any[];
    return rows.map(row => ({
      id: row.id,
      content: row.content,
      metadata: row.metadata,
      embedding: row.embedding,
      createdAt: row.created_at
    }));
  }

  public shutdown(): void {
    this.db.close();
  }
}
