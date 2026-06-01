import { Container } from 'inversify';
import { EventEmitter } from 'events';
export class IroncladKernel {
    container;
    domains = new Map();
    eventBus;
    constructor() {
        this.container = new Container();
        this.eventBus = new EventEmitter();
        this.setupCoreBindings();
    }
    setupCoreBindings() {
        this.container.bind('EventBus').toConstantValue(this.eventBus);
        this.container.bind('Kernel').toConstantValue(this);
    }
    async loadDomain(domain) {
        if (this.domains.has(domain.name)) {
            throw new Error(`Domain ${domain.name} already loaded`);
        }
        await domain.initialize(this.container);
        this.domains.set(domain.name, domain);
        this.eventBus.emit('domain_loaded', domain.name);
    }
    getDomain(name) {
        const domain = this.domains.get(name);
        if (!domain) {
            throw new Error(`Domain ${name} not found`);
        }
        return domain;
    }
    getContainer() {
        return this.container;
    }
    async shutdown() {
        for (const domain of this.domains.values()) {
            if (domain.shutdown) {
                await domain.shutdown();
            }
        }
    }
}
