import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class BootstrappingDomain implements Domain {
    readonly name = "bootstrapping";
    initialize(container: Container): Promise<void>;
}
