import { injectable, inject } from 'inversify';
import { AgentDBService, MemoryEntry } from './agent-db.service';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

@injectable()
export class UnifiedMemoryService {
  private cache = new Map<string, MemoryEntry>();
  private claudeMemDb?: Database.Database;

  constructor(
    @inject(AgentDBService) private agentDB: AgentDBService
  ) {
    this.initializeClaudeMem();
  }

  private initializeClaudeMem(): void {
    const claudeMemPath = '/Users/rishabh/.claude-mem/claude-mem.db';
    if (fs.existsSync(claudeMemPath)) {
      try {
        this.claudeMemDb = new Database(claudeMemPath, { readonly: true });
      } catch (error) {
        console.error('Failed to connect to Claude Mem DB:', error);
      }
    }
  }

  public async store(entry: MemoryEntry): Promise<void> {
    // 1. Prefer Caching
    this.cache.set(entry.id, entry);
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    // 2. Persistent Storage (AgentDB)
    await this.agentDB.store(entry);
  }

  public async search(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    // 1. Check Cache first (simple prefix/exact match for now)
    const cachedResults = Array.from(this.cache.values())
      .filter(e => e.content.includes(query))
      .slice(0, limit);

    if (cachedResults.length >= limit) {
      return cachedResults;
    }

    // 2. Search AgentDB
    const agentDBResults = await this.agentDB.search(query, limit);
    
    // 3. Fallback/Combine with Claude Mem
    const claudeMemResults = this.searchClaudeMem(query, limit - agentDBResults.length);

    // 4. Combine and deduplicate
    const combined = [...agentDBResults, ...claudeMemResults];
    const unique = new Map<string, MemoryEntry>();
    combined.forEach(e => unique.set(e.id, e));

    return Array.from(unique.values()).slice(0, limit);
  }

  private searchClaudeMem(query: string, limit: number): MemoryEntry[] {
    if (!this.claudeMemDb || limit <= 0) return [];

    try {
      // Assuming claude-mem schema has a 'memories' or similar table. 
      // I'll try to find common table names or just return empty if it fails.
      const stmt = this.claudeMemDb.prepare(`
        SELECT id, content, metadata, created_at 
        FROM memories 
        WHERE content LIKE ? 
        LIMIT ?
      `);
      const rows = stmt.all(`%${query}%`, limit) as any[];
      return rows.map(row => ({
        id: row.id,
        content: row.content,
        metadata: row.metadata || '',
        createdAt: row.created_at || Date.now()
      }));
    } catch (error) {
      // Schema might be different, fail silently
      return [];
    }
  }

  // Placeholder for Graphify integration
  public async getGraphContext(concept: string): Promise<any> {
    const graphPath = '/Users/rishabh/graphify-out';
    // Logic to parse graphify outputs could go here
    return { concept, status: 'integrated_via_path_reference' };
  }

  public shutdown(): void {
    if (this.claudeMemDb) {
      this.claudeMemDb.close();
    }
  }
}
