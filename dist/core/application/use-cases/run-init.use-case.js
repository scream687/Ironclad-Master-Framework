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
import { InitService } from '../../domains/bootstrapping/services/init.service.js';
import { UniversalRulesService } from '../../domains/bootstrapping/services/universal-rules.service.js';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service.js';
let RunInitUseCase = class RunInitUseCase {
    initService;
    rulesService;
    truthEnforcement;
    constructor(initService, rulesService, truthEnforcement) {
        this.initService = initService;
        this.rulesService = rulesService;
        this.truthEnforcement = truthEnforcement;
    }
    async execute(targetDir) {
        try {
            await this.initService.ironcladDirectory(targetDir);
            await this.rulesService.syncAllRules(targetDir);
            return this.truthEnforcement.enforceTruth({ success: true }, `Universal initialization: ${targetDir}`);
        }
        catch (error) {
            return this.truthEnforcement.enforceTruth(error, `Universal initialization: ${targetDir}`);
        }
    }
};
RunInitUseCase = __decorate([
    injectable(),
    __param(0, inject(InitService)),
    __param(1, inject(UniversalRulesService)),
    __param(2, inject(TruthEnforcementService)),
    __metadata("design:paramtypes", [InitService,
        UniversalRulesService,
        TruthEnforcementService])
], RunInitUseCase);
export { RunInitUseCase };
