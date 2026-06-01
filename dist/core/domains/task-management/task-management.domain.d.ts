import { Container } from 'inversify';
import { Domain } from '../../kernel/ironclad-kernel';
export declare class TaskManagementDomain implements Domain {
    readonly name = "task-management";
    initialize(container: Container): Promise<void>;
}
