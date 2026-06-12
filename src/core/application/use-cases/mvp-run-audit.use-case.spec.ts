import { describe, it, expect } from 'vitest';
import { MVPRunAuditUseCase } from './mvp-run-audit.use-case';
import { AuditService } from '../../domains/quality-assurance/services/audit.service';

describe('MVPRunAuditUseCase', () => {
  it('executes audit', async () => {
    const auditService = new AuditService();
    const useCase = new MVPRunAuditUseCase(auditService);
    const result = await useCase.execute();
    expect(result).toHaveProperty('totalScore');
    expect(result).toHaveProperty('categories');
  });

  it('gets stats', () => {
    const auditService = new AuditService();
    const useCase = new MVPRunAuditUseCase(auditService);
    const stats = useCase.getStats();
    expect(stats).toHaveProperty('files');
    expect(stats).toHaveProperty('components');
  });
});
