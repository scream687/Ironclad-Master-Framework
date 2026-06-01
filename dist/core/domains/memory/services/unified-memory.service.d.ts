import { AgentDBService, MemoryEntry } from './agent-db.service';
export declare class UnifiedMemoryService {
    private agentDB;
    private cache;
    private claudeMemDb?;
    constructor(agentDB: AgentDBService);
    private initializeClaudeMem;
    store(entry: MemoryEntry): Promise<void>;
    search(query: string, limit?: number): Promise<MemoryEntry[]>;
    private searchClaudeMem;
    getGraphContext(concept: string): Promise<any>;
    shutdown(): void;
}
