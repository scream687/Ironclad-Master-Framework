var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from 'inversify';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
let AgentDBService = class AgentDBService {
    db;
    constructor() {
        const dbPath = path.resolve('.ai-core', 'memory.db');
        if (!fs.existsSync(path.dirname(dbPath))) {
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        }
        this.db = new Database(dbPath);
        this.initializeSchema();
    }
    initializeSchema() {
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
    get dbInstance() {
        return this.db;
    }
    async store(entry) {
        const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO memories (id, content, metadata, embedding, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(entry.id, entry.content, entry.metadata, entry.embedding, entry.createdAt);
    }
    async search(query, limit = 10) {
        // Basic text search for now since we don't have HNSW yet
        const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE content LIKE ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
        const rows = stmt.all(`%${query}%`, limit);
        return rows.map(row => ({
            id: row.id,
            content: row.content,
            metadata: row.metadata,
            embedding: row.embedding,
            createdAt: row.created_at
        }));
    }
    shutdown() {
        this.db.close();
    }
};
AgentDBService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], AgentDBService);
export { AgentDBService };
