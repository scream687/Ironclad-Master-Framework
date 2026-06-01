export declare class GitService {
    generateEliteCommit(): Promise<string>;
    commitAndPush(message: string): Promise<void>;
}
