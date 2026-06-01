import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';

export interface LibraryMetadata {
  name: string;
  url: string;
  framework: string;
  tier: 'Elite' | 'Premium' | 'Standard';
  notes: string;
}

@injectable()
export class DiscoveryService {
  constructor(
    @inject(AgentDBService) private agentDB: AgentDBService
  ) {}

  public async ingestAwesomeList(libraries: LibraryMetadata[]): Promise<void> {
    for (const lib of libraries) {
      await this.agentDB.store({
        id: `lib_${lib.name.toLowerCase().replace(/\s+/g, '_')}`,
        content: `UI Library: ${lib.name} (${lib.url}) - Framework: ${lib.framework}. Tier: ${lib.tier}. Notes: ${lib.notes}`,
        metadata: JSON.stringify(lib),
        createdAt: Date.now()
      });
    }
  }

  public async getEliteLibraries(): Promise<LibraryMetadata[]> {
    const results = await this.agentDB.search('Tier: Elite', 50);
    return results.map(r => JSON.parse(rowToMetadata(r)));
  }
}

function rowToMetadata(row: any): string {
    return row.metadata || "{}";
}
