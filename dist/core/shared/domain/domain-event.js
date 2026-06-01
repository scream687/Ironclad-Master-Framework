export class DomainEvent {
    eventId;
    aggregateId;
    occurredOn;
    eventVersion;
    constructor(aggregateId) {
        this.eventId = crypto.randomUUID();
        this.aggregateId = aggregateId;
        this.occurredOn = new Date();
        this.eventVersion = 1;
    }
}
