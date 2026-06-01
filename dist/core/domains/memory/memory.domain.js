import { AgentDBService } from './services/agent-db.service';
export class MemoryDomain {
    name = 'memory';
    agentDBService;
    async initialize(container) {
        this.agentDBService = new AgentDBService();
        container.bind(AgentDBService).toConstantValue(this.agentDBService);
    }
    async shutdown() {
        if (this.agentDBService) {
            this.agentDBService.shutdown();
        }
    }
}
