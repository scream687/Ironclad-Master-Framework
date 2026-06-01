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
import { SkillService } from '../../domains/intelligence-hub/services/skill.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { EventEmitter } from 'events';
let FetchSkillUseCase = class FetchSkillUseCase {
    skillService;
    truthEnforcement;
    eventBus;
    constructor(skillService, truthEnforcement, eventBus) {
        this.skillService = skillService;
        this.truthEnforcement = truthEnforcement;
        this.eventBus = eventBus;
    }
    async execute(repo) {
        this.eventBus.emit('fetch_started', repo);
        try {
            await this.skillService.fetchSkill(repo);
            this.eventBus.emit('fetch_succeeded', repo);
            return this.truthEnforcement.enforceTruth({ success: true }, `Fetch skill: ${repo}`);
        }
        catch (error) {
            this.eventBus.emit('fetch_failed', { repo, error });
            return this.truthEnforcement.enforceTruth(error, `Fetch skill: ${repo}`);
        }
    }
};
FetchSkillUseCase = __decorate([
    injectable(),
    __param(0, inject(SkillService)),
    __param(1, inject(TruthEnforcementService)),
    __param(2, inject('EventBus')),
    __metadata("design:paramtypes", [SkillService,
        TruthEnforcementService,
        EventEmitter])
], FetchSkillUseCase);
export { FetchSkillUseCase };
