export interface ExecResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    success: boolean;
}
export declare class ExecService {
    executeCommand(command: string, args: string[]): Promise<ExecResult>;
}
