import { injectable } from 'inversify';
import { spawn } from 'child_process';

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

@injectable()
export class ExecService {
  public async executeCommand(command: string, args: string[]): Promise<ExecResult> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { shell: true });
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        const exitCode = code ?? 0;
        resolve({
          stdout,
          stderr,
          exitCode,
          success: exitCode === 0 && !stderr.toLowerCase().includes('error')
        });
      });
    });
  }
}
