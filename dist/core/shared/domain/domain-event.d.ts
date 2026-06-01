export declare abstract class DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly occurredOn: Date;
    readonly eventVersion: number;
    constructor(aggregateId: string);
}
