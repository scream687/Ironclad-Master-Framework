import { TruthScoreResult, AuditIssue } from '../scoring/types';
export declare class TerminalUI {
    static renderHeader(): void;
    static renderStats(fileCount: number, componentCount: number, routeCount: number): void;
    static renderTruthScore(result: TruthScoreResult): void;
    static renderTopIssues(issues: AuditIssue[]): void;
    static renderCertification(result: TruthScoreResult): void;
    static renderFixPreview(result: TruthScoreResult): void;
}
