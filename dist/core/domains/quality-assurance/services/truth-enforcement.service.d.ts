import { TruthReport } from '../entities/truth-report.entity';
export declare class TruthEnforcementService {
    /**
     * Evaluates a result against the Truth Factor.
     * If errors exist, it forces a "Truth" statement to escape hallucination.
     */
    enforceTruth(result: any, context?: string): TruthReport;
    private generateTruthStatement;
}
