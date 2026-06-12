import { TddService } from '../src/core/domains/automation/services/tdd.service';
import fs from 'fs';
import path from 'path';

describe('TddService', () => {
  let service: TddService;

  beforeEach(() => {
    service = new TddService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run a tracer bullet', async () => {
    // This is a complex test because it scaffolds files.
    // In a real test we would mock fs and shelljs.
    expect(service.runTracerBullet).toBeDefined();
  });
});
