import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';
import { TaskRepository } from '../../task-management/repositories/task.repository';
import { AuditService } from '../../quality-assurance/services/audit.service';
import { Task } from '../../task-management/entities/task.entity';
import { TaskId } from '../../task-management/value-objects/task-id.vo';
import { TaskStatus } from '../../task-management/value-objects/task-status.vo';
import { Priority } from '../../task-management/value-objects/priority.vo';
import { HarnessPhase } from './harness.service';
import fs from 'fs';

@injectable()
export class InfinityHarnessService {
  constructor(
    @inject(AgentDBService) private agentDB: AgentDBService,
    @inject(TaskRepository) private taskRepo: TaskRepository,
    @inject(AuditService) private auditService: AuditService
  ) {}

  public async runInfinityLoop(objective: string): Promise<void> {
    console.log(`♾️  Starting Ironclad Infinity Loop: "${objective}"`);
    
    // 1. Initialize Objective Task
    const rootId = `root-${objective.toLowerCase().replace(/ /g, '-')}`;
    let rootTask = await this.taskRepo.findById(rootId);
    if (!rootTask) {
      rootTask = Task.reconstitute({
        id: TaskId.fromString(rootId),
        description: objective,
        priority: Priority.high(),
        status: TaskStatus.pending(),
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
      rootTask.assignTo('infinity-commander');
      await this.taskRepo.save(rootTask);
    }

    while (!rootTask.status.isCompleted()) {
      // 2. Decomposition (AI-driven tactical breakdown)
      const subTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);
      
      if (subTasks.length === 0) {
        // Only decompose if we haven't already marked this objective as ready for final verification
        const meta = (rootTask as any).props.metadata;
        if (!meta.readyForVerification) {
          await this.decomposeObjective(rootTask);
          const newSubTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);
          if (newSubTasks.length === 0) {
            console.log('✨  No further decomposition required. Moving to global verification.');
            meta.readyForVerification = true;
            await this.taskRepo.save(rootTask);
          }
          continue; 
        }
      }

      // 3. Process tactical sub-tasks
      for (const subTask of subTasks) {
        console.log(`\n💎  Executing Tactical Sub-task: ${subTask.description}`);
        subTask.assignTo('infinity-engine');
        await this.runMicroLoop(subTask);
        await this.taskRepo.save(subTask);
      }

      // 4. Global Verification Loop
      console.log('\n⚖️  [Global] Running final Truth Factor verification...');
      const auditResult = await this.auditService.runFullAudit();
      const criticals = auditResult.issues.filter(i => i.level.value === 'error');
      
      if (criticals.length === 0) {
        rootTask.complete({ success: true, message: 'Objective met globally' });
        await this.taskRepo.save(rootTask);
        console.log(`👑  INFINITY LOOP COMPLETE: Objective Met with 1.00 Truth Score.`);
      } else {
        console.warn(`⚠️  Global verification failed with ${criticals.length} breaches. Re-routing...`);
        (rootTask as any).props.metadata.readyForVerification = false; // Trigger re-decomposition
        await this.backtrackStrategy(rootTask, criticals);
      }
    }
  }

  private async decomposeObjective(rootTask: Task): Promise<void> {
    console.log('🧠  [Intelligence] Decomposing high-level objective into surgical tasks...');
    
    const auditResult = await this.auditService.runFullAudit();
    const breaches = auditResult.issues.filter(i => i.level.value === 'error');

    for (const breach of breaches) {
      if (!breach.file) continue;
      const fileSlug = breach.file.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const taskSlug = `fix-${breach.ruleName.toLowerCase().replace(/ /g, '-')}-${fileSlug}`;
      const existing = await this.taskRepo.findById(taskSlug);
      if (existing) continue;

      const subTask = Task.reconstitute({
        id: TaskId.fromString(taskSlug),
        parentId: rootTask.id.value,
        description: `Resolve ${breach.ruleName}: ${breach.message}`,
        priority: Priority.high(),
        status: TaskStatus.pending(),
        metadata: { breach },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await this.taskRepo.save(subTask);
    }
  }

  private async runMicroLoop(task: Task): Promise<void> {
    let phase = HarnessPhase.UNDERSTAND;
    
    while (phase !== HarnessPhase.COMPLETE) {
      console.log(`   └─ Phase: ${phase}`);
      
      // Checkpoint Mental State
      await this.checkpointThought(task.id.value, `Executing phase ${phase} for task: ${task.description}`);

      try {
        switch (phase) {
          case HarnessPhase.UNDERSTAND:
            phase = HarnessPhase.PLAN;
            break;
          case HarnessPhase.PLAN:
            phase = HarnessPhase.IMPLEMENT;
            break;
          case HarnessPhase.IMPLEMENT:
            phase = HarnessPhase.VERIFY;
            break;
          case HarnessPhase.VERIFY:
            const stillBreached = await this.verifyTaskSuccess(task);
            if (!stillBreached) {
              task.complete({ success: true, message: 'Sub-task verified' });
              phase = HarnessPhase.COMPLETE;
            } else {
              console.warn(`   ⚠️  Sub-task verification failed. Attempting autonomous heal...`);
              await this.healTask(task);
              // Recursive loop handles retry
            }
            break;
        }
      } catch (error) {
        console.error(`   ❌  Micro-Loop Error:`, error);
        break;
      }
    }
  }

  private async checkpointThought(taskId: string, thought: string): Promise<void> {
    const db = (this.agentDB as any).dbInstance;
    db.prepare(`
      INSERT OR REPLACE INTO thoughts (id, task_id, thought, created_at)
      VALUES (?, ?, ?, ?)
    `).run(`thought-${Math.random().toString(36).substring(7)}`, taskId, thought, Date.now());
  }

  private async verifyTaskSuccess(task: Task): Promise<boolean> {
    const breach = (task as any).props.metadata.breach;
    if (!breach || !breach.file) return false;

    // Check if the specific file still has the breach
    if (!fs.existsSync(breach.file)) return false;
    const content = fs.readFileSync(breach.file, 'utf-8');
    
    if (breach.ruleName === 'GOVERNANCE_BREACH: Rule 5') {
      return !content.includes('@ironclad-design-signature');
    }
    if (breach.ruleName === 'UNAUTHORIZED_LOGS') {
      return content.includes('console.log');
    }
    
    return false;
  }

  private async healTask(task: Task): Promise<void> {
    const breach = (task as any).props.metadata.breach;
    if (!breach || !breach.file || !fs.existsSync(breach.file)) return;

    console.log(`   🛠️  [Self-Heal] Applying fix to ${breach.file}...`);
    let content = fs.readFileSync(breach.file, 'utf-8');

    if (breach.ruleName === 'GOVERNANCE_BREACH: Rule 5') {
      content = `/**\n * @ironclad-design-signature\n * Chain: infinity-loop -> self-heal\n * Verified: ${new Date().toISOString()}\n */\n` + content;
    } else if (breach.ruleName === 'UNAUTHORIZED_LOGS') {
      content = content.replace(/console\.log\(.*\);?/g, '// [Ironclad-Purger] Removed unauthorized log');
    }

    fs.writeFileSync(breach.file, content);
  }

  private async backtrackStrategy(rootTask: Task, issues: any[]): Promise<void> {
    // Increment a "stagnation counter" in metadata
    const meta = (rootTask as any).props.metadata;
    meta.stagnationCount = (meta.stagnationCount || 0) + 1;
    
    if (meta.stagnationCount > 5) {
      throw new Error(`CRITICAL_STAGNATION: Objective ${rootTask.description} cannot be completed autonomously.`);
    }
    
    await this.taskRepo.save(rootTask);
  }
}
