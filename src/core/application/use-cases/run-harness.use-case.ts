import { injectable, inject } from 'inversify';
import { HarnessService } from '../../domains/automation/services/harness.service';

@injectable()
export class RunHarnessUseCase {
  constructor(
    @inject(HarnessService) private harnessService: HarnessService
  ) {}

  async execute(goal: string): Promise<void> {
    await this.harnessService.run(goal);
  }
}
