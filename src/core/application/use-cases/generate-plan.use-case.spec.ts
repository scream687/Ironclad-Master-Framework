import { describe, it, expect } from 'vitest';
import { GeneratePlanUseCase } from './generate-plan.use-case';

describe('GeneratePlanUseCase', () => {
  it('instantiates without error', () => {
    expect(() => new GeneratePlanUseCase({} as any)).not.toThrow();
  });
});
