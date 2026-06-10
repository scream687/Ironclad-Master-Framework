export declare class PlanningService {
    private readonly PLANS_DIR;
    generateSparcSpec(goal: string, context: string): Promise<{
        path: string;
        content: string;
    }>;
    brainstorm(topic: string): Promise<string[]>;
}
