import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class AutomationDomain implements Domain {
    readonly name = "automation";
    initialize(container: Container): Promise<void>;
}
