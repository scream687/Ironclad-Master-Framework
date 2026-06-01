import { AgentDBService } from '../../memory/services/agent-db.service';
export interface LibraryMetadata {
    name: string;
    url: string;
    framework: string;
    tier: 'Elite' | 'Premium' | 'Standard';
    notes: string;
}
export declare class DiscoveryService {
    private agentDB;
    constructor(agentDB: AgentDBService);
    ingestAwesomeList(libraries: LibraryMetadata[]): Promise<void>;
    getEliteLibraries(): Promise<LibraryMetadata[]>;
}
