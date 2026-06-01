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
import { AuditService } from '../../domains/quality-assurance/services/audit.service';
import { EventEmitter } from 'events';
let RunAuditUseCase = class RunAuditUseCase {
    auditService;
    eventBus;
    constructor(auditService, eventBus) {
        this.auditService = auditService;
        this.eventBus = eventBus;
    }
    async execute() {
        this.eventBus.emit('audit_started');
        const result = await this.auditService.runFullAudit();
        if (result.success) {
            this.eventBus.emit('audit_succeeded', result);
        }
        else {
            this.eventBus.emit('audit_failed', result);
        }
        return result;
    }
};
RunAuditUseCase = __decorate([
    injectable(),
    __param(0, inject(AuditService)),
    __param(1, inject('EventBus')),
    __metadata("design:paramtypes", [AuditService,
        EventEmitter])
], RunAuditUseCase);
export { RunAuditUseCase };
