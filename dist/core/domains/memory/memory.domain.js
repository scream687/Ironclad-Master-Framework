import { AgentDBService } from './services/agent-db.service';
import { UnifiedMemoryService } from './services/unified-memory.service';
export class MemoryDomain {
    name = 'memory';
    agentDBService;
    unifiedMemoryService;
    async initialize(container) {
        this.agentDBService = new AgentDBService();
        this.unifiedMemoryService = new UnifiedMemoryService(this.agentDBService);
        container.bind(AgentDBService).toConstantValue(this.agentDBService);
        container.bind(UnifiedMemoryService).toConstantValue(this.unifiedMemoryService);
    }
    async shutdown() {
        if (this.agentDBService) {
            this.agentDBService.shutdown();
        }
        if (this.unifiedMemoryService) {
            this.unifiedMemoryService.shutdown();
        }
    }
}
