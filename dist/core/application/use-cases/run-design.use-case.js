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
import { DesignService } from '../../domains/automation/services/design.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
let RunDesignUseCase = class RunDesignUseCase {
    designService;
    truthEnforcement;
    constructor(designService, truthEnforcement) {
        this.designService = designService;
        this.truthEnforcement = truthEnforcement;
    }
    async execute(path) {
        const findings = await this.designService.auditFrontendAesthetics(path);
        return this.truthEnforcement.enforceTruth({ success: true }, `Design audit: ${path}`);
    }
};
RunDesignUseCase = __decorate([
    injectable(),
    __param(0, inject(DesignService)),
    __param(1, inject(TruthEnforcementService)),
    __metadata("design:paramtypes", [DesignService,
        TruthEnforcementService])
], RunDesignUseCase);
export { RunDesignUseCase };
