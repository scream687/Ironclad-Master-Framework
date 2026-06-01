import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class IntelligenceHubDomain implements Domain {
    readonly name = "intelligence-hub";
    initialize(container: Container): Promise<void>;
}
