import { HarnessService } from '../../domains/automation/services/harness.service';
export declare class RunHarnessUseCase {
    private harnessService;
    constructor(harnessService: HarnessService);
    execute(goal: string): Promise<void>;
}
