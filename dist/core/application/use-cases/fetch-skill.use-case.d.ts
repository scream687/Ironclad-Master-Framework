import { SkillService } from '../../domains/intelligence-hub/services/skill.service';
import { EventEmitter } from 'events';
export declare class FetchSkillUseCase {
    private skillService;
    private eventBus;
    constructor(skillService: SkillService, eventBus: EventEmitter);
    execute(repo: string): Promise<void>;
}
