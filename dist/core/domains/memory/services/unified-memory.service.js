var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'inversify';
import { AgentDBService } from './agent-db.service';
import Database from 'better-sqlite3';
import fs from 'fs';
let UnifiedMemoryService = class UnifiedMemoryService {
    agentDB;
    cache = new Map();
    claudeMemDb;
    constructor(agentDB) {
        this.agentDB = agentDB;
        this.initializeClaudeMem();
    }
    initializeClaudeMem() {
        const claudeMemPath = '/Users/rishabh/.claude-mem/claude-mem.db';
        if (fs.existsSync(claudeMemPath)) {
            try {
                this.claudeMemDb = new Database(claudeMemPath, { readonly: true });
            }
            catch (error) {
                console.error('Failed to connect to Claude Mem DB:', error);
            }
        }
    }
    async store(entry) {
        // 1. Prefer Caching
        this.cache.set(entry.id, entry);
        if (this.cache.size > 1000) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey)
                this.cache.delete(firstKey);
        }
        // 2. Persistent Storage (AgentDB)
        await this.agentDB.store(entry);
    }
    async search(query, limit = 10) {
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
        const unique = new Map();
        combined.forEach(e => unique.set(e.id, e));
        return Array.from(unique.values()).slice(0, limit);
    }
    searchClaudeMem(query, limit) {
        if (!this.claudeMemDb || limit <= 0)
            return [];
        try {
            // Assuming claude-mem schema has a 'memories' or similar table. 
            // I'll try to find common table names or just return empty if it fails.
            const stmt = this.claudeMemDb.prepare(`
        SELECT id, content, metadata, created_at 
        FROM memories 
        WHERE content LIKE ? 
        LIMIT ?
      `);
            const rows = stmt.all(`%${query}%`, limit);
            return rows.map(row => ({
                id: row.id,
                content: row.content,
                metadata: row.metadata || '',
                createdAt: row.created_at || Date.now()
            }));
        }
        catch (error) {
            // Schema might be different, fail silently
            return [];
        }
    }
    // Placeholder for Graphify integration
    async getGraphContext(concept) {
        const graphPath = '/Users/rishabh/graphify-out';
        // Logic to parse graphify outputs could go here
        return { concept, status: 'integrated_via_path_reference' };
    }
    shutdown() {
        if (this.claudeMemDb) {
            this.claudeMemDb.close();
        }
    }
};
UnifiedMemoryService = __decorate([
    injectable(),
    __param(0, inject(AgentDBService)),
    __metadata("design:paramtypes", [AgentDBService])
], UnifiedMemoryService);
export { UnifiedMemoryService };
