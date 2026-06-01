import { Container } from 'inversify';
export interface Domain {
    name: string;
    initialize(container: Container): Promise<void>;
    shutdown?(): Promise<void>;
}
export declare class IroncladKernel {
    private container;
    private domains;
    private eventBus;
    constructor();
    private setupCoreBindings;
    loadDomain(domain: Domain): Promise<void>;
    getDomain<T extends Domain>(name: string): T;
    getContainer(): Container;
    shutdown(): Promise<void>;
}
