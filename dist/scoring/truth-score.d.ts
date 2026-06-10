import { AuditIssue, TruthScoreResult } from './types';
export declare class TruthScoreCalculator {
    private readonly weights;
    calculate(issues: AuditIssue[]): TruthScoreResult;
    private calculateCategoryScore;
}
