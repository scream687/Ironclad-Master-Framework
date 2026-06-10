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
import { PlanningService } from '../../domains/strategic-planning/services/planning.service';
import { EventEmitter } from 'events';
let BrainstormUseCase = class BrainstormUseCase {
    planningService;
    eventBus;
    constructor(planningService, eventBus) {
        this.planningService = planningService;
        this.eventBus = eventBus;
    }
    async execute(topic) {
        const ideas = await this.planningService.brainstorm(topic);
        this.eventBus.emit('brainstorm_completed', topic);
        return ideas;
    }
};
BrainstormUseCase = __decorate([
    injectable(),
    __param(0, inject(PlanningService)),
    __param(1, inject('EventBus')),
    __metadata("design:paramtypes", [PlanningService,
        EventEmitter])
], BrainstormUseCase);
export { BrainstormUseCase };
