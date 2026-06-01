import { Entity } from './entity';
import { DomainEvent } from './domain-event';
export declare abstract class AggregateRoot<T> extends Entity<T> {
    private _version;
    get version(): number;
    protected incrementVersion(): void;
    applyEvent(event: DomainEvent): void;
}
