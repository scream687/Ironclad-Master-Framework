import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';
import { Task } from '../entities/task.entity';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { Priority } from '../value-objects/priority.vo';

@injectable()
export class TaskRepository {
  constructor(
    @inject(AgentDBService) private agentDB: any // Injected via kernel
  ) {}

  public async save(task: any): Promise<void> {
    const db = (this.agentDB as any).db;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, parent_id, description, status, priority, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      task.id.value,
      task.parentId,
      task.description,
      task.status.value,
      task.priority.value,
      JSON.stringify(task.metadata),
      task.createdAt.getTime(),
      task.updatedAt.getTime()
    );
  }

  public async findById(id: string): Promise<Task | null> {
    const db = (this.agentDB as any).db;
    const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
    if (!row) return null;

    return Task.reconstitute({
      id: TaskId.fromString(row.id),
      parentId: row.parent_id,
      description: row.description,
      status: TaskStatus.fromString(row.status),
      priority: Priority.fromString(row.priority),
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    });
  }

  public async findPendingSubTasks(parentId: string): Promise<Task[]> {
    const db = (this.agentDB as any).db;
    const rows = db.prepare(`SELECT * FROM tasks WHERE parent_id = ? AND status != 'completed'`).all(parentId);
    return rows.map((row: any) => Task.reconstitute({
      id: TaskId.fromString(row.id),
      parentId: row.parent_id,
      description: row.description,
      status: TaskStatus.fromString(row.status),
      priority: Priority.fromString(row.priority),
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
}
