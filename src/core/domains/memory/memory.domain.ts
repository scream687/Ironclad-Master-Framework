import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { AgentDBService } from './services/agent-db.service';

export class MemoryDomain implements Domain {
  readonly name = 'memory';
  private agentDBService?: AgentDBService;

  async initialize(container: Container): Promise<void> {
    this.agentDBService = new AgentDBService();
    container.bind<AgentDBService>(AgentDBService).toConstantValue(this.agentDBService);
  }

  async shutdown(): Promise<void> {
    if (this.agentDBService) {
      this.agentDBService.shutdown();
    }
  }
}
