var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { injectable, inject } from 'inversify';
import { AgentDBService } from '../../memory/services/agent-db.service';
let DiscoveryService = class DiscoveryService {
    agentDB;
    constructor(agentDB) {
        this.agentDB = agentDB;
    }
    async ingestAwesomeList(libraries) {
        for (const lib of libraries) {
            await this.agentDB.store({
                id: `lib_${lib.name.toLowerCase().replace(/\s+/g, '_')}`,
                content: `UI Library: ${lib.name} (${lib.url}) - Framework: ${lib.framework}. Tier: ${lib.tier}. Notes: ${lib.notes}`,
                metadata: JSON.stringify(lib),
                createdAt: Date.now()
            });
        }
    }
    async getEliteLibraries() {
        const results = await this.agentDB.search('Tier: Elite', 50);
        return results.map(r => JSON.parse(rowToMetadata(r)));
    }
};
DiscoveryService = __decorate([
    injectable(),
    __param(0, inject(AgentDBService)),
    __metadata("design:paramtypes", [typeof (_a = typeof AgentDBService !== "undefined" && AgentDBService) === "function" ? _a : Object])
], DiscoveryService);
export { DiscoveryService };
function rowToMetadata(row) {
    return row.metadata || "{}";
}
