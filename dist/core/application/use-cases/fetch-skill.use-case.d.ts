import { SkillService } from '../../domains/intelligence-hub/services/skill.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
import { EventEmitter } from 'events';
export declare class FetchSkillUseCase {
    private skillService;
    private truthEnforcement;
    private eventBus;
    constructor(skillService: SkillService, truthEnforcement: TruthEnforcementService, eventBus: EventEmitter);
    execute(repo: string): Promise<TruthReport>;
}
