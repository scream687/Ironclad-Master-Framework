import { AgentDBService } from '../../memory/services/agent-db.service';
import { AuditService } from '../../quality-assurance/services/audit.service';
export declare enum HarnessPhase {
    UNDERSTAND = "UNDERSTAND",
    PLAN = "PLAN",
    DELEGATE = "DELEGATE",
    IMPLEMENT = "IMPLEMENT",
    VERIFY = "VERIFY",
    COMPLETE = "COMPLETE"
}
export interface HarnessState {
    goal: string;
    currentPhase: HarnessPhase;
    progress: number;
    history: string[];
    lastError?: string;
    subTasks: string[];
}
export declare class HarnessService {
    private agentDB;
    private auditService;
    private readonly STATE_FILE;
    constructor(agentDB: AgentDBService, auditService: AuditService);
    run(goal: string): Promise<void>;
    private loadState;
    private saveState;
    private clearState;
    private persistToMemory;
    private executeUnderstand;
    private executePlan;
    private executeDelegate;
    private executeImplement;
    private executeVerify;
}
