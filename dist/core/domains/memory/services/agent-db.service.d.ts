import Database from 'better-sqlite3';
export interface MemoryEntry {
    id: string;
    content: string;
    metadata: string;
    embedding?: Buffer;
    createdAt: number;
}
export declare class AgentDBService {
    private db;
    constructor();
    private initializeSchema;
    get dbInstance(): Database.Database;
    store(entry: MemoryEntry): Promise<void>;
    search(query: string, limit?: number): Promise<MemoryEntry[]>;
    shutdown(): void;
}
