import { Entity } from './entity';
export class AggregateRoot extends Entity {
    _version = 0;
    get version() {
        return this._version;
    }
    incrementVersion() {
        this._version++;
    }
    applyEvent(event) {
        this.addDomainEvent(event);
        this.incrementVersion();
    }
}
