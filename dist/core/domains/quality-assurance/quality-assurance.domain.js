import { AuditService } from './services/audit.service';
import { RunAuditUseCase } from '../../application/use-cases/run-audit.use-case';
export class QualityAssuranceDomain {
    name = 'quality-assurance';
    async initialize(container) {
        container.bind(AuditService).toSelf().inSingletonScope();
        container.bind(RunAuditUseCase).toSelf().inSingletonScope();
    }
}
