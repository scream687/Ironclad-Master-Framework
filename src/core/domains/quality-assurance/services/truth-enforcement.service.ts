import { injectable } from 'inversify';
import { TruthReport } from '../entities/truth-report.entity';
import { AuditResult } from '../entities/audit-result.entity';
import { AuditLevel } from '../value-objects/audit-level.vo';

@injectable()
export class TruthEnforcementService {
  /**
   * Evaluates a result against the Truth Factor.
   * If errors exist, it forces a "Truth" statement to escape hallucination.
   */
  public enforceTruth(result: any, context?: string): TruthReport {
    const alerts: string[] = [];
    let isTrue = true;
    let confidence = 1.0;

    // Detect potential hallucinations or vague failures
    if (result instanceof Error) {
      isTrue = false;
      confidence = 0.0;
      alerts.push(`CRITICAL FAILURE: ${result.message}`);
    } else if (result && result.success === false) {
      isTrue = false;
      confidence = 0.5; // It's a known failure, but maybe partially explained
      if (result.issues) {
        const errorCount = result.issues.filter((i: any) => i.level.value === 'error').length;
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

  private generateTruthStatement(isTrue: boolean, confidence: number, context?: string): string {
    if (isTrue && confidence >= 0.95) {
      return `TRUTH: Operations verified. Codebase is elite and factual accuracy is maintained.`;
    }
    
    return `TRUTH: Factual integrity breached. ${context || 'Current state'} contains non-elite patterns or errors. ESCAPING HALLUCINATION: System rejects this state.`;
  }
}
