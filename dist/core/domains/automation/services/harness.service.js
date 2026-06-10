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
import { AgentDBService } from '../../memory/services/agent-db.service';
import { AuditService } from '../../quality-assurance/services/audit.service';
import fs from 'fs';
export var HarnessPhase;
(function (HarnessPhase) {
    HarnessPhase["UNDERSTAND"] = "UNDERSTAND";
    HarnessPhase["PLAN"] = "PLAN";
    HarnessPhase["DELEGATE"] = "DELEGATE";
    HarnessPhase["IMPLEMENT"] = "IMPLEMENT";
    HarnessPhase["VERIFY"] = "VERIFY";
    HarnessPhase["COMPLETE"] = "COMPLETE";
})(HarnessPhase || (HarnessPhase = {}));
let HarnessService = class HarnessService {
    agentDB;
    auditService;
    STATE_FILE = '.ai-core/harness_state.json';
    constructor(agentDB, auditService) {
        this.agentDB = agentDB;
        this.auditService = auditService;
    }
    async run(goal) {
        console.log(`🛡️  Initializing Ironclad Eternal Harness for: "${goal}"`);
        let state = this.loadState(goal);
        while (state.currentPhase !== HarnessPhase.COMPLETE) {
            try {
                console.log(`\n--- Phase: ${state.currentPhase} ---`);
                switch (state.currentPhase) {
                    case HarnessPhase.UNDERSTAND:
                        await this.executeUnderstand(state);
                        state.currentPhase = HarnessPhase.PLAN;
                        break;
                    case HarnessPhase.PLAN:
                        await this.executePlan(state);
                        state.currentPhase = HarnessPhase.DELEGATE;
                        break;
                    case HarnessPhase.DELEGATE:
                        await this.executeDelegate(state);
                        state.currentPhase = HarnessPhase.IMPLEMENT;
                        break;
                    case HarnessPhase.IMPLEMENT:
                        await this.executeImplement(state);
                        state.currentPhase = HarnessPhase.VERIFY;
                        break;
                    case HarnessPhase.VERIFY:
                        const success = await this.executeVerify(state);
                        if (success) {
                            console.log('✅  Verification Passed. Truth Score satisfies thresholds.');
                            state.currentPhase = HarnessPhase.COMPLETE;
                        }
                        else {
                            console.warn('⚠️  Verification FAILED. Governance Breach Detected.');
                            console.log('🔄  Triggering Autonomous Self-Healing Loop...');
                            state.history.push(`Failed verification at ${new Date().toISOString()}. Self-healing activated.`);
                            state.currentPhase = HarnessPhase.UNDERSTAND; // Recursive retry
                        }
                        break;
                }
                this.saveState(state);
                await this.persistToMemory(state);
            }
            catch (error) {
                console.error(`❌  Harness Error in phase ${state.currentPhase}:`, error.message);
                state.lastError = error.message;
                this.saveState(state);
                break; // Pause and wait for manual intervention or restart
            }
        }
        if (state.currentPhase === HarnessPhase.COMPLETE) {
            console.log(`✅  Harness Objective Accomplished: ${state.goal}`);
            this.clearState();
        }
    }
    loadState(goal) {
        if (fs.existsSync(this.STATE_FILE)) {
            const data = JSON.parse(fs.readFileSync(this.STATE_FILE, 'utf-8'));
            if (data.goal === goal)
                return data;
        }
        return {
            goal,
            currentPhase: HarnessPhase.UNDERSTAND,
            progress: 0,
            history: [],
            subTasks: []
        };
    }
    saveState(state) {
        if (!fs.existsSync('.ai-core'))
            fs.mkdirSync('.ai-core');
        fs.writeFileSync(this.STATE_FILE, JSON.stringify(state, null, 2));
    }
    clearState() {
        if (fs.existsSync(this.STATE_FILE))
            fs.unlinkSync(this.STATE_FILE);
    }
    async persistToMemory(state) {
        await this.agentDB.store({
            id: `harness-${Date.now()}`,
            content: `Harness Progress: ${state.currentPhase} for goal: ${state.goal}`,
            metadata: JSON.stringify(state),
            createdAt: Date.now()
        });
    }
    // --- Phase Logic (Placeholders for Autonomous Execution) ---
    async executeUnderstand(state) {
        console.log('🔍 [Understand] Mapping architectural dependencies...');
        state.history.push(`Completed Understand phase at ${new Date().toISOString()}`);
        // Real logic would invoke Understand-Anything engine
    }
    async executePlan(state) {
        console.log('📋 [Plan] Drafting SPARC specifications...');
        state.history.push(`Completed Plan phase at ${new Date().toISOString()}`);
    }
    async executeDelegate(state) {
        console.log('🤖 [Delegate] Spawning agent swarms...');
        state.history.push(`Completed Delegate phase at ${new Date().toISOString()}`);
    }
    async executeImplement(state) {
        console.log('🏗️  [Implement] Executing surgical code changes...');
        state.history.push(`Completed Implement phase at ${new Date().toISOString()}`);
    }
    async executeVerify(state) {
        console.log('🧪 [Verify] Running Truth Factor verification...');
        const result = await this.auditService.runFullAudit();
        const criticalIssues = result.issues.filter(i => i.level.value === 'error');
        if (criticalIssues.length > 0) {
            console.error(`❌  Found ${criticalIssues.length} Critical Governance Breaches.`);
            criticalIssues.forEach(i => console.log(`    - ${i.ruleName}: ${i.message}`));
            return false;
        }
        return true;
    }
};
HarnessService = __decorate([
    injectable(),
    __param(0, inject(AgentDBService)),
    __param(1, inject(AuditService)),
    __metadata("design:paramtypes", [AgentDBService,
        AuditService])
], HarnessService);
export { HarnessService };
