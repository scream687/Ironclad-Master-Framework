import { AgentDBService } from '../../memory/services/agent-db.service';
import { TaskRepository } from '../../task-management/repositories/task.repository';
import { AuditService } from '../../quality-assurance/services/audit.service';
export declare class InfinityHarnessService {
    private agentDB;
    private taskRepo;
    private auditService;
    constructor(agentDB: AgentDBService, taskRepo: TaskRepository, auditService: AuditService);
    runInfinityLoop(objective: string): Promise<void>;
    private decomposeObjective;
    private runMicroLoop;
    private checkpointThought;
    private verifyTaskSuccess;
    private healTask;
    private backtrackStrategy;
}
