import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class MemoryDomain implements Domain {
    readonly name = "memory";
    private agentDBService?;
    initialize(container: Container): Promise<void>;
    shutdown(): Promise<void>;
}
