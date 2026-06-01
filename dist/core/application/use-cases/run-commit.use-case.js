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
var _a, _b;
import { injectable, inject } from 'inversify';
import { GitService } from '../../domains/automation/services/git.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
let RunCommitUseCase = class RunCommitUseCase {
    gitService;
    truthEnforcement;
    constructor(gitService, truthEnforcement) {
        this.gitService = gitService;
        this.truthEnforcement = truthEnforcement;
    }
    async execute() {
        const message = await this.gitService.generateEliteCommit();
        if (message === 'No changes to commit.') {
            return this.truthEnforcement.enforceTruth({ success: true }, 'Git automation: Idle');
        }
        await this.gitService.commitAndPush(message);
        return this.truthEnforcement.enforceTruth({ success: true }, `Git automation: ${message}`);
    }
};
RunCommitUseCase = __decorate([
    injectable(),
    __param(0, inject(GitService)),
    __param(1, inject(TruthEnforcementService)),
    __metadata("design:paramtypes", [typeof (_a = typeof GitService !== "undefined" && GitService) === "function" ? _a : Object, typeof (_b = typeof TruthEnforcementService !== "undefined" && TruthEnforcementService) === "function" ? _b : Object])
], RunCommitUseCase);
export { RunCommitUseCase };
