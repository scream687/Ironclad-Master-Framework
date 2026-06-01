import { Container } from 'inversify';
import { EventEmitter } from 'events';

export interface Domain {
  name: string;
  initialize(container: Container): Promise<void>;
  shutdown?(): Promise<void>;
}

export class IroncladKernel {
  private container: Container;
  private domains: Map<string, Domain> = new Map();
  private eventBus: EventEmitter;

  constructor() {
    this.container = new Container();
    this.eventBus = new EventEmitter();
    this.setupCoreBindings();
  }

  private setupCoreBindings(): void {
    this.container.bind<EventEmitter>('EventBus').toConstantValue(this.eventBus);
    this.container.bind<IroncladKernel>('Kernel').toConstantValue(this);
  }

  async loadDomain(domain: Domain): Promise<void> {
    if (this.domains.has(domain.name)) {
      throw new Error(`Domain ${domain.name} already loaded`);
    }

    await domain.initialize(this.container);
    this.domains.set(domain.name, domain);
    this.eventBus.emit('domain_loaded', domain.name);
  }

  getDomain<T extends Domain>(name: string): T {
    const domain = this.domains.get(name);
    if (!domain) {
      throw new Error(`Domain ${name} not found`);
    }
    return domain as T;
  }

  getContainer(): Container {
    return this.container;
  }

  async shutdown(): Promise<void> {
    for (const domain of this.domains.values()) {
      if (domain.shutdown) {
        await domain.shutdown();
      }
    }
  }
}
