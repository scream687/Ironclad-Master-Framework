import { DiscoveryService } from './discovery.service';
export interface DesignComponent {
    name: string;
    source: 'shadcn' | 'magic-ui' | '21st-dev' | 'framer-motion' | 'uiverse' | 'external';
    code: string;
    aesthetic: string;
}
export declare class DesignService {
    private discoveryService;
    constructor(discoveryService: DiscoveryService);
    /**
     * Performs a God-Tier aesthetic audit using the 'design-taste-frontend' skill logic.
     */
    auditFrontendAesthetics(path: string): Promise<string[]>;
    /**
     * Fetches elite components via MCP servers or Uiverse.io logic.
     */
    fetchComponent(registry: string, componentName: string): Promise<DesignComponent>;
    /**
     * Orchestrates the full design evolution for a path.
     */
    evolveDesign(path: string): Promise<void>;
    private readDirectorySafe;
}
