import { injectable, inject } from 'inversify';
import { DiscoveryService, LibraryMetadata } from '../../domains/automation/services/discovery.service';
import { TruthEnforcementService } from '../../domains/quality-assurance/services/truth-enforcement.service';
import { TruthReport } from '../../domains/quality-assurance/entities/truth-report.entity';

@injectable()
export class RunDiscoveryUseCase {
  constructor(
    @inject(DiscoveryService) private discoveryService: DiscoveryService,
    @inject(TruthEnforcementService) private truthEnforcement: TruthEnforcementService
  ) {}

  async execute(customList?: LibraryMetadata[]): Promise<TruthReport> {
    // Default list if none provided (from the earlier web_fetch)
    const defaultLibs: LibraryMetadata[] = [
      { name: 'Ant Design', url: 'https://ant.design/', framework: 'React', tier: 'Elite', notes: 'Enterprise-class' },
      { name: 'Material UI', url: 'https://mui.com/', framework: 'React', tier: 'Elite', notes: 'Industry standard' },
      { name: 'Shadcn/ui', url: 'https://ui.shadcn.com/', framework: 'React', tier: 'Elite', notes: 'Premium feel' },
      { name: 'Magic UI', url: 'https://magicui.design/', framework: 'React', tier: 'Premium', notes: 'High-end animated' },
      { name: 'Uiverse.io', url: 'https://uiverse.io/', framework: 'CSS/HTML', tier: 'Elite', notes: 'Community components' }
    ];

    await this.discoveryService.ingestAwesomeList(customList || defaultLibs);
    return this.truthEnforcement.enforceTruth({ success: true }, 'UI Intelligence Discovery');
  }
}
