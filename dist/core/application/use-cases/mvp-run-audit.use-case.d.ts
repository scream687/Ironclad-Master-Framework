import { TruthScoreResult } from '../../../scoring/types';
export declare class MVPRunAuditUseCase {
    private archScanner;
    private testScanner;
    private secScanner;
    private perfScanner;
    private a11yScanner;
    private calculator;
    execute(): Promise<TruthScoreResult>;
    getStats(): {
        files: number;
        components: number;
        routes: number;
    };
}
