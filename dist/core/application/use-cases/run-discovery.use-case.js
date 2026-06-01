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
import { DiscoveryService } from '../../domains/automation/services/discovery.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
let RunDiscoveryUseCase = class RunDiscoveryUseCase {
    discoveryService;
    truthEnforcement;
    constructor(discoveryService, truthEnforcement) {
        this.discoveryService = discoveryService;
        this.truthEnforcement = truthEnforcement;
    }
    async execute(customList) {
        // Default list if none provided (from the earlier web_fetch)
        const defaultLibs = [
            { name: 'Ant Design', url: 'https://ant.design/', framework: 'React', tier: 'Elite', notes: 'Enterprise-class' },
            { name: 'Material UI', url: 'https://mui.com/', framework: 'React', tier: 'Elite', notes: 'Industry standard' },
            { name: 'Shadcn/ui', url: 'https://ui.shadcn.com/', framework: 'React', tier: 'Elite', notes: 'Premium feel' },
            { name: 'Magic UI', url: 'https://magicui.design/', framework: 'React', tier: 'Premium', notes: 'High-end animated' },
            { name: 'Uiverse.io', url: 'https://uiverse.io/', framework: 'CSS/HTML', tier: 'Elite', notes: 'Community components' }
        ];
        await this.discoveryService.ingestAwesomeList(customList || defaultLibs);
        return this.truthEnforcement.enforceTruth({ success: true }, 'UI Intelligence Discovery');
    }
};
RunDiscoveryUseCase = __decorate([
    injectable(),
    __param(0, inject(DiscoveryService)),
    __param(1, inject(TruthEnforcementService)),
    __metadata("design:paramtypes", [typeof (_a = typeof DiscoveryService !== "undefined" && DiscoveryService) === "function" ? _a : Object, typeof (_b = typeof TruthEnforcementService !== "undefined" && TruthEnforcementService) === "function" ? _b : Object])
], RunDiscoveryUseCase);
export { RunDiscoveryUseCase };
