var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable, decorate, inject } from 'inversify';
import { AuditService } from '../../domains/quality-assurance/services/audit.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
import { EventEmitter } from 'events';
let RunAuditUseCase = class RunAuditUseCase {
    auditService;
    truthEnforcement;
    eventBus;
    constructor(auditService, truthEnforcement, eventBus) {
        this.auditService = auditService;
        this.truthEnforcement = truthEnforcement;
        this.eventBus = eventBus;
    }
    async execute() {
        this.eventBus.emit('audit_started');
        const result = await this.auditService.runFullAudit();
        const truth = this.truthEnforcement.enforceTruth(result, 'Audit cycle');
        if (result.success) {
            this.eventBus.emit('audit_succeeded', result);
        }
        else {
            this.eventBus.emit('audit_failed', result);
        }
        return { result, truth };
    }
};
RunAuditUseCase = __decorate([
    injectable(),
    __metadata("design:paramtypes", [AuditService,
        TruthEnforcementService,
        EventEmitter])
], RunAuditUseCase);
export { RunAuditUseCase };
decorate(inject(AuditService), RunAuditUseCase, 0);
decorate(inject(TruthEnforcementService), RunAuditUseCase, 1);
decorate(inject('EventBus'), RunAuditUseCase, 2);
