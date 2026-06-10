export interface RuleFile {
    name: string;
    platform: string;
    filename: string;
    template: string;
}
export declare class UniversalRulesService {
    private readonly rules;
    syncAllRules(targetDir: string): Promise<string[]>;
    private getDistilledMandates;
}
