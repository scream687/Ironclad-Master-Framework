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
import { TaskId } from '../../domains/task-management/value-objects/task-id.vo';
import { EventEmitter } from 'events';
let AssignTaskUseCase = class AssignTaskUseCase {
    taskRepository;
    eventBus;
    constructor(taskRepository, eventBus) {
        this.taskRepository = taskRepository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const taskId = TaskId.fromString(command.taskId);
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error(`Task ${command.taskId} not found`);
        }
        task.assignTo(command.agentId);
        await this.taskRepository.save(task);
        // Publish domain events
        for (const event of task.getUncommittedEvents()) {
            this.eventBus.emit(event.constructor.name, event);
        }
        task.markEventsAsCommitted();
    }
};
AssignTaskUseCase = __decorate([
    injectable(),
    __param(0, inject('TaskRepository')),
    __param(1, inject('EventBus')),
    __metadata("design:paramtypes", [Object, EventEmitter])
], AssignTaskUseCase);
export { AssignTaskUseCase };
