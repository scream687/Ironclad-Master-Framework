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
import { DistillationService } from '../../domains/intelligence-hub/services/distillation.service';
import { EventEmitter } from 'events';
let UpgradeFrameworkUseCase = class UpgradeFrameworkUseCase {
    distillationService;
    eventBus;
    constructor(distillationService, eventBus) {
        this.distillationService = distillationService;
        this.eventBus = eventBus;
    }
    async execute() {
        this.eventBus.emit('upgrade_started');
        try {
            await this.distillationService.distillPatterns();
            await this.distillationService.upgradeMandates();
            this.eventBus.emit('upgrade_succeeded');
        }
        catch (error) {
            this.eventBus.emit('upgrade_failed', error);
            throw error;
        }
    }
};
UpgradeFrameworkUseCase = __decorate([
    injectable(),
    __param(0, inject(DistillationService)),
    __param(1, inject('EventBus')),
    __metadata("design:paramtypes", [DistillationService,
        EventEmitter])
], UpgradeFrameworkUseCase);
export { UpgradeFrameworkUseCase };
