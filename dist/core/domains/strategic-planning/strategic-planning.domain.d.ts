import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class StrategicPlanningDomain implements Domain {
    readonly name = "strategic-planning";
    initialize(container: Container): Promise<void>;
}
