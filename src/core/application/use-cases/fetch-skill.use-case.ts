import { injectable, inject } from 'inversify';
import { SkillService } from '../../domains/intelligence-hub/services/skill.service';
import { EventEmitter } from 'events';

@injectable()
export class FetchSkillUseCase {
  constructor(
    @inject(SkillService) private skillService: SkillService,
    @inject('EventBus') private eventBus: EventEmitter
  ) {}

  async execute(repo: string): Promise<void> {
    this.eventBus.emit('fetch_started', repo);
    try {
      await this.skillService.fetchSkill(repo);
      this.eventBus.emit('fetch_succeeded', repo);
    } catch (error) {
      this.eventBus.emit('fetch_failed', { repo, error });
      throw error;
    }
  }
}
