import { injectable, inject } from 'inversify';
import { ExecService } from '../../domains/bootstrapping/services/exec.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunExecUseCase {
  constructor(
    @inject(ExecService) private execService: ExecService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(command: string, args: string[]): Promise<TruthReport> {
    const result = await this.execService.executeCommand(command, args);
    return this.truthEnforcement.enforceTruth(result, `External execution: ${command}`);
  }
}
