export type IssueLevel = 'minor' | 'major' | 'critical';
export interface AuditIssue {
    category: 'architecture' | 'testing' | 'security' | 'performance' | 'accessibility';
    level: IssueLevel;
    name: string;
    message: string;
    file?: string;
    risk: string;
    fix: string;
    autoFixable: boolean;
}
export interface CategoryScore {
    score: number;
    weight: number;
    issues: AuditIssue[];
}
export interface TruthScoreResult {
    totalScore: number;
    categories: {
        architecture: CategoryScore;
        testing: CategoryScore;
        security: CategoryScore;
        performance: CategoryScore;
        accessibility: CategoryScore;
    };
    totalIssues: number;
    levelCounts: {
        critical: number;
        major: number;
        minor: number;
    };
}
