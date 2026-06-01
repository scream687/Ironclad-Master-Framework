import { DomainEvent } from './domain-event';
export declare abstract class Entity<T> {
    protected readonly _id: T;
    private _domainEvents;
    constructor(id: T);
    get id(): T;
    equals(object?: Entity<T>): boolean;
    protected addDomainEvent(domainEvent: DomainEvent): void;
    getUncommittedEvents(): DomainEvent[];
    markEventsAsCommitted(): void;
}
