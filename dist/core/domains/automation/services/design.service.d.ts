export interface DesignComponent {
    name: string;
    source: 'shadcn' | 'magic-ui' | '21st-dev' | 'framer-motion';
    code: string;
    aesthetic: string;
}
export declare class DesignService {
    /**
     * Performs a God-Tier aesthetic audit using the 'design-taste-frontend' skill logic.
     */
    auditFrontendAesthetics(path: string): Promise<string[]>;
    /**
     * Fetches elite components via MCP servers (shadcn, magic-ui, 21st-dev, framer-motion).
     */
    fetchComponent(registry: string, componentName: string): Promise<DesignComponent>;
    /**
     * Orchestrates the full design evolution for a path.
     */
    evolveDesign(path: string): Promise<void>;
    private readDirectorySafe;
}
