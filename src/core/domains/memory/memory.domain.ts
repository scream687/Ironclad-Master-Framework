import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { AgentDBService } from './services/agent-db.service';
import { UnifiedMemoryService } from './services/unified-memory.service';

export class MemoryDomain implements Domain {
  readonly name = 'memory';
  private agentDBService?: AgentDBService;
  private unifiedMemoryService?: UnifiedMemoryService;

  async initialize(container: Container): Promise<void> {
    this.agentDBService = new AgentDBService();
    this.unifiedMemoryService = new UnifiedMemoryService(this.agentDBService);
    
    container.bind<AgentDBService>(AgentDBService).toConstantValue(this.agentDBService);
    container.bind<UnifiedMemoryService>(UnifiedMemoryService).toConstantValue(this.unifiedMemoryService);
  }

  async shutdown(): Promise<void> {
    if (this.agentDBService) {
      this.agentDBService.shutdown();
    }
    if (this.unifiedMemoryService) {
      this.unifiedMemoryService.shutdown();
    }
  }
}
