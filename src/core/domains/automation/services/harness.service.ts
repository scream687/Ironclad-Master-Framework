import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';
import { AuditService } from '../../quality-assurance/services/audit.service';
import fs from 'fs';
import path from 'path';

export enum HarnessPhase {
  UNDERSTAND = 'UNDERSTAND',
  PLAN = 'PLAN',
  DELEGATE = 'DELEGATE',
  IMPLEMENT = 'IMPLEMENT',
  VERIFY = 'VERIFY',
  COMPLETE = 'COMPLETE'
}

export interface HarnessState {
  goal: string;
  currentPhase: HarnessPhase;
  progress: number;
  history: string[];
  lastError?: string;
  subTasks: string[];
}

@injectable()
export class HarnessService {
  private readonly STATE_FILE = '.ai-core/harness_state.json';

  constructor(
    @inject(AgentDBService) private agentDB: AgentDBService,
    @inject(AuditService) private auditService: AuditService,
  ) {}

  public async run(goal: string): Promise<void> {
    console.log(`🛡️  Initializing Ironclad Eternal Harness for: "${goal}"`);
    let state = this.loadState(goal);

    while (state.currentPhase !== HarnessPhase.COMPLETE) {
      try {
        console.log(`\n--- Phase: ${state.currentPhase} ---`);
        switch (state.currentPhase) {
          case HarnessPhase.UNDERSTAND:
            await this.executeUnderstand(state);
            state.currentPhase = HarnessPhase.PLAN;
            break;
          case HarnessPhase.PLAN:
            await this.executePlan(state);
            state.currentPhase = HarnessPhase.DELEGATE;
            break;
          case HarnessPhase.DELEGATE:
            await this.executeDelegate(state);
            state.currentPhase = HarnessPhase.IMPLEMENT;
            break;
          case HarnessPhase.IMPLEMENT:
            await this.executeImplement(state);
            state.currentPhase = HarnessPhase.VERIFY;
            break;
          case HarnessPhase.VERIFY:
            const success = await this.executeVerify(state);
            if (success) {
              console.log('✅  Verification Passed. Truth Score satisfies thresholds.');
              state.currentPhase = HarnessPhase.COMPLETE;
            } else {
              console.warn('⚠️  Verification FAILED. Governance Breach Detected.');
              console.log('🔄  Triggering Autonomous Self-Healing Loop...');
              state.history.push(`Failed verification at ${new Date().toISOString()}. Self-healing activated.`);
              state.currentPhase = HarnessPhase.UNDERSTAND; // Recursive retry
            }
            break;
        }
        this.saveState(state);
        await this.persistToMemory(state);
      } catch (error: any) {
        console.error(`❌  Harness Error in phase ${state.currentPhase}:`, error.message);
        state.lastError = error.message;
        this.saveState(state);
        break; // Pause and wait for manual intervention or restart
      }
    }

    if (state.currentPhase === HarnessPhase.COMPLETE) {
      console.log(`✅  Harness Objective Accomplished: ${state.goal}`);
      this.clearState();
    }
  }

  private loadState(goal: string): HarnessState {
    if (fs.existsSync(this.STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(this.STATE_FILE, 'utf-8'));
      if (data.goal === goal) return data;
    }
    return {
      goal,
      currentPhase: HarnessPhase.UNDERSTAND,
      progress: 0,
      history: [],
      subTasks: []
    };
  }

  private saveState(state: HarnessState): void {
    if (!fs.existsSync('.ai-core')) fs.mkdirSync('.ai-core');
    fs.writeFileSync(this.STATE_FILE, JSON.stringify(state, null, 2));
  }

  private clearState(): void {
    if (fs.existsSync(this.STATE_FILE)) fs.unlinkSync(this.STATE_FILE);
  }

  private async persistToMemory(state: HarnessState): Promise<void> {
    await this.agentDB.store({
      id: `harness-${Date.now()}`,
      content: `Harness Progress: ${state.currentPhase} for goal: ${state.goal}`,
      metadata: JSON.stringify(state),
      createdAt: Date.now()
    });
  }

  // --- Phase Logic (Placeholders for Autonomous Execution) ---

  private async executeUnderstand(state: HarnessState) {
    console.log('🔍 [Understand] Mapping architectural dependencies...');
    state.history.push(`Completed Understand phase at ${new Date().toISOString()}`);
    // Real logic would invoke Understand-Anything engine
  }

  private async executePlan(state: HarnessState) {
    console.log('📋 [Plan] Drafting SPARC specifications...');
    state.history.push(`Completed Plan phase at ${new Date().toISOString()}`);
  }

  private async executeDelegate(state: HarnessState) {
    console.log('🤖 [Delegate] Spawning agent swarms...');
    state.history.push(`Completed Delegate phase at ${new Date().toISOString()}`);
  }

  private async executeImplement(state: HarnessState) {
    console.log('🏗️  [Implement] Executing surgical code changes...');
    state.history.push(`Completed Implement phase at ${new Date().toISOString()}`);
  }

  private async executeVerify(state: HarnessState): Promise<boolean> {
    console.log('🧪 [Verify] Running Truth Factor verification...');
    const result = await this.auditService.runFullAudit();
    const criticalIssues = result.issues.filter(i => i.level.value === 'error');
    
    if (criticalIssues.length > 0) {
      console.error(`❌  Found ${criticalIssues.length} Critical Governance Breaches.`);
      criticalIssues.forEach(i => console.log(`    - ${i.ruleName}: ${i.message}`));
      return false;
    }
    return true; 
  }
}
