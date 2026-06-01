export class Entity {
    _id;
    _domainEvents = [];
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    equals(object) {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!(object instanceof Entity)) {
            return false;
        }
        return this._id === object._id;
    }
    addDomainEvent(domainEvent) {
        this._domainEvents.push(domainEvent);
    }
    getUncommittedEvents() {
        return this._domainEvents;
    }
    markEventsAsCommitted() {
        this._domainEvents = [];
    }
}
