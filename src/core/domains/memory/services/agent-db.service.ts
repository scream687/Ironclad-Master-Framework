import { injectable } from 'inversify';
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
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at)`);
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
