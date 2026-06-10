var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';
import { Task } from '../entities/task.entity';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';
import { Priority } from '../value-objects/priority.vo';
let TaskRepository = class TaskRepository {
    agentDB;
    constructor(agentDB // Injected via kernel
    ) {
        this.agentDB = agentDB;
    }
    async save(task) {
        const db = this.agentDB.db;
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, parent_id, description, status, priority, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(task.id.value, task.props.parentId, task.description, task.status.value, task.priority.value, JSON.stringify(task.props.metadata), task.createdAt.getTime(), task.updatedAt.getTime());
    }
    async findById(id) {
        const db = this.agentDB.db;
        const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
        if (!row)
            return null;
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
    async findPendingSubTasks(parentId) {
        const db = this.agentDB.db;
        const rows = db.prepare(`SELECT * FROM tasks WHERE parent_id = ? AND status != 'completed'`).all(parentId);
        return rows.map((row) => Task.reconstitute({
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
};
TaskRepository = __decorate([
    injectable(),
    __param(0, inject(AgentDBService)),
    __metadata("design:paramtypes", [Object])
], TaskRepository);
export { TaskRepository };
