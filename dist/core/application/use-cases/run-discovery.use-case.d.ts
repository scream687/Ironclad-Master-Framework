import { DiscoveryService, LibraryMetadata } from '../../domains/automation/services/discovery.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';
export declare class RunDiscoveryUseCase {
    private discoveryService;
    private truthEnforcement;
    constructor(discoveryService: DiscoveryService, truthEnforcement: TruthEnforcementService);
    execute(customList?: LibraryMetadata[]): Promise<TruthReport>;
}
