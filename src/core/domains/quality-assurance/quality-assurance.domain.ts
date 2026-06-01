import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
import { AuditService } from './services/audit.service';
import { RunAuditUseCase } from '../../application/use-cases/run-audit.use-case';

export class QualityAssuranceDomain implements Domain {
  readonly name = 'quality-assurance';

  async initialize(container: Container): Promise<void> {
    container.bind<AuditService>(AuditService).toSelf().inSingletonScope();
    container.bind<RunAuditUseCase>(RunAuditUseCase).toSelf().inSingletonScope();
  }
}
