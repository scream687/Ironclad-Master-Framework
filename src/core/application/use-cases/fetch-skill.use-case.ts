import { injectable, inject } from 'inversify';
import { SkillService } from '../../domains/intelligence-hub/services/skill.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
import { EventEmitter } from 'events';

@injectable()
export class FetchSkillUseCase {
  constructor(
    @inject(SkillService) private skillService: SkillService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(repo: string): Promise<TruthReport> {
    this.eventBus.emit('fetch_started', repo);
    try {
      await this.skillService.fetchSkill(repo);
      this.eventBus.emit('fetch_succeeded', repo);
      return this.truthEnforcement.enforceTruth({ success: true }, `Fetch skill: ${repo}`);
    } catch (error) {
      this.eventBus.emit('fetch_failed', { repo, error });
      return this.truthEnforcement.enforceTruth(error, `Fetch skill: ${repo}`);
    }
  }
}
