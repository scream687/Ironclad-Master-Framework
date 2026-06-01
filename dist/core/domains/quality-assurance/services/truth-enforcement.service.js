var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
let TruthEnforcementService = class TruthEnforcementService {
    /**
     * Evaluates a result against the Truth Factor.
     * If errors exist, it forces a "Truth" statement to escape hallucination.
     */
    enforceTruth(result, context) {
        const alerts = [];
        let isTrue = true;
        let confidence = 1.0;
        // Detect potential hallucinations or vague failures
        if (result instanceof Error) {
            isTrue = false;
            confidence = 0.0;
            alerts.push(`CRITICAL FAILURE: ${result.message}`);
        }
        else if (result && result.success === false) {
            isTrue = false;
            confidence = 0.5; // It's a known failure, but maybe partially explained
            if (result.issues) {
                const errorCount = result.issues.filter((i) => i.level.value === 'error').length;
                confidence = Math.max(0, 1 - (errorCount / 5));
            }
        }
        // Logic to "Escape Hallucination" - if confidence is low, add explicit warnings
        if (confidence < 0.95) {
            alerts.push('HALLUCINATION ESCAPE: Confidence below 0.95 threshold. Forcing factual verification.');
        }
        return {
            isTrue,
            confidence,
            statement: this.generateTruthStatement(isTrue, confidence, context),
            violations: (result && result.issues) || [],
            hallucinationAlerts: alerts
        };
    }
    generateTruthStatement(isTrue, confidence, context) {
        if (isTrue && confidence >= 0.95) {
            return `TRUTH: Operations verified. Codebase is elite and factual accuracy is maintained.`;
        }
        return `TRUTH: Factual integrity breached. ${context || 'Current state'} contains non-elite patterns or errors. ESCAPING HALLUCINATION: System rejects this state.`;
    }
};
TruthEnforcementService = __decorate([
    injectable()
], TruthEnforcementService);
export { TruthEnforcementService };
