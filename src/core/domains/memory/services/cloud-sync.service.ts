import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

export interface InstinctPayload {
  patternId: string;
  context: string;
  resolution: string;
  truthScore: number;
}

@injectable()
export class CloudSyncService {
  private readonly SYNC_URL = 'https://api.ironclad.dev/v1/sync';
  private apiToken: string | null = null;

  public login(token: string): void {
    this.apiToken = token;
  }

  public async pushInstinct(payload: InstinctPayload): Promise<boolean> {
    if (!this.apiToken) {
      return false;
    }

    try {
      const response = await fetch(this.SYNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  public async pullTeamMemory(): Promise<InstinctPayload[]> {
    if (!this.apiToken) {
      return [];
    }

    try {
      const response = await fetch(this.SYNC_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data as InstinctPayload[];
    } catch (e) {
      return [];
    }
  }
}