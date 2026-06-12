import { WatchService } from '../src/core/domains/automation/services/watch.service';

describe('WatchService', () => {
  let service: WatchService;

  beforeEach(() => {
    service = new WatchService();
  });

  it('should compress context by stripping comments', async () => {
    const code = `
      // Single line comment
      /* Block 
         comment */
      const x = 10;
      console.log(x);
    `;
    const compressed = await service.compressContext(code);
    expect(compressed).not.toContain('//');
    expect(compressed).not.toContain('/*');
    expect(compressed).not.toContain('console.log');
    expect(compressed).toContain('const x = 10;');
  });
});
