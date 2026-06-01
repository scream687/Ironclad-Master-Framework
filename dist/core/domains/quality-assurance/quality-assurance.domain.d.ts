import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class QualityAssuranceDomain implements Domain {
    readonly name = "quality-assurance";
    initialize(container: Container): Promise<void>;
}
