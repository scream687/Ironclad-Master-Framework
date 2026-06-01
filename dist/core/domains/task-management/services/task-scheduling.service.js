var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
let TaskSchedulingService = class TaskSchedulingService {
    prioritizeTasks(tasks) {
        return [...tasks].sort((a, b) => b.priority.getNumericValue() - a.priority.getNumericValue());
    }
    calculateEstimatedDuration(task) {
        const baseTime = 300000; // 5 minutes
        const priorityMultiplier = {
            low: 0.5,
            medium: 1.0,
            high: 1.5,
            critical: 2.0
        };
        return baseTime * (priorityMultiplier[task.priority.value] || 1.0);
    }
};
TaskSchedulingService = __decorate([
    injectable()
], TaskSchedulingService);
export { TaskSchedulingService };
